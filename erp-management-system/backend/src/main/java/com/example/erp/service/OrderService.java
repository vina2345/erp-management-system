package com.example.erp.service;

import com.example.erp.exception.InsufficientStockException;
import com.example.erp.exception.ResourceNotFoundException;
import com.example.erp.model.*;
import com.example.erp.repository.CustomerRepository;
import com.example.erp.repository.OrderRepository;
import com.example.erp.repository.ProductRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    /** Request body for placing an order. */
    public static class OrderRequest {
        @NotNull(message = "customerId is required")
        public Long customerId;
        @NotEmpty(message = "Order must contain at least one item")
        @Valid
        public List<Line> items;
    }

    public static class Line {
        @NotNull(message = "productId is required")
        public Long productId;
        @NotNull(message = "quantity is required")
        @Min(value = 1, message = "quantity must be at least 1")
        public Integer quantity;
    }

    private final OrderRepository orders;
    private final CustomerRepository customers;
    private final ProductRepository products;

    public OrderService(OrderRepository orders, CustomerRepository customers, ProductRepository products) {
        this.orders = orders; this.customers = customers; this.products = products;
    }

    /** Resolves customer/product by id, checks and deducts stock, computes the total. */
    @Transactional
    public Order create(OrderRequest req) {
        Customer customer = customers.findById(req.customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", req.customerId));

        Order order = new Order();
        order.setCustomer(customer);
        BigDecimal total = BigDecimal.ZERO;

        for (Line line : req.items) {
            Product p = products.findById(line.productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product", line.productId));
            if (p.getStockQuantity() < line.quantity) {
                throw new InsufficientStockException("Insufficient stock for '" + p.getName()
                        + "'. Available: " + p.getStockQuantity() + ", requested: " + line.quantity);
            }
            p.setStockQuantity(p.getStockQuantity() - line.quantity);

            OrderItem item = new OrderItem();
            item.setProduct(p);
            item.setQuantity(line.quantity);
            item.setUnitPrice(p.getPrice());
            item.setLineTotal(p.getPrice().multiply(BigDecimal.valueOf(line.quantity)));
            order.addItem(item);
            total = total.add(item.getLineTotal());
        }
        order.setTotalAmount(total);
        return orders.save(order);
    }

    @Transactional(readOnly = true)
    public List<Order> findAll() { return orders.findAll(); }

    @Transactional(readOnly = true)
    public Order find(Long id) {
        return orders.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }

    /** Changes status; moving to CANCELLED restores stock. A cancelled order cannot be changed. */
    @Transactional
    public Order updateStatus(Long id, OrderStatus newStatus) {
        Order order = find(id);
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("A cancelled order cannot be changed");
        }
        if (newStatus == OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                Product p = item.getProduct();
                p.setStockQuantity(p.getStockQuantity() + item.getQuantity());
            }
        }
        order.setStatus(newStatus);
        return orders.save(order);
    }
}
