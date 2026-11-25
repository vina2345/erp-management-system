package com.example.erp.controller;

import com.example.erp.model.Order;
import com.example.erp.model.OrderStatus;
import com.example.erp.service.OrderService;
import com.example.erp.service.OrderService.OrderRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) { this.service = service; }

    @GetMapping
    public List<Order> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Order getOne(@PathVariable Long id) { return service.find(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order create(@Valid @RequestBody OrderRequest request) { return service.create(request); }

    /** PUT /api/orders/5/status?status=SHIPPED  (CANCELLED restores stock) */
    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return service.updateStatus(id, status);
    }
}
