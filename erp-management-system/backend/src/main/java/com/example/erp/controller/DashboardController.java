package com.example.erp.controller;

import com.example.erp.repository.*;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final CustomerRepository customers;
    private final ProductRepository products;
    private final EmployeeRepository employees;
    private final DepartmentRepository departments;
    private final OrderRepository orders;

    public DashboardController(CustomerRepository c, ProductRepository p, EmployeeRepository e,
                               DepartmentRepository d, OrderRepository o) {
        this.customers = c; this.products = p; this.employees = e; this.departments = d; this.orders = o;
    }

    @GetMapping
    public Map<String, Object> stats() {
        BigDecimal revenue = orders.totalRevenue();
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("customers", customers.count());
        m.put("products", products.count());
        m.put("employees", employees.count());
        m.put("departments", departments.count());
        m.put("orders", orders.count());
        m.put("revenue", revenue == null ? BigDecimal.ZERO : revenue);
        m.put("lowStock", products.findLowStock());
        m.put("recentOrders", orders.findTop5ByOrderByIdDesc());
        return m;
    }
}
