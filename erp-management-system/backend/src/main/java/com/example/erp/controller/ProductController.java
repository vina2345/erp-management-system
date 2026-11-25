package com.example.erp.controller;

import com.example.erp.exception.ResourceNotFoundException;
import com.example.erp.model.Product;
import com.example.erp.repository.ProductRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository repo;

    public ProductController(ProductRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Product> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Product getOne(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@Valid @RequestBody Product in) {
        in.setId(null);
        return repo.save(in);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody Product in) {
        getOne(id);
        in.setId(id);
        return repo.save(in);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repo.delete(getOne(id));
    }
}
