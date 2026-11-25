package com.example.erp.repository;

import com.example.erp.model.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("select p from Product p where p.stockQuantity <= p.reorderLevel order by p.stockQuantity asc")
    List<Product> findLowStock();
}
