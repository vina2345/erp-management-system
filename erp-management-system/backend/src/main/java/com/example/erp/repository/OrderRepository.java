package com.example.erp.repository;

import com.example.erp.model.Order;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findTop5ByOrderByIdDesc();

    @Query("select sum(o.totalAmount) from Order o where o.status <> com.example.erp.model.OrderStatus.CANCELLED")
    BigDecimal totalRevenue();
}
