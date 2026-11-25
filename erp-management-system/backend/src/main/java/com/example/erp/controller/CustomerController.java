package com.example.erp.controller;

import com.example.erp.exception.ResourceNotFoundException;
import com.example.erp.model.Customer;
import com.example.erp.repository.CustomerRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerRepository repo;

    public CustomerController(CustomerRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Customer> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Customer getOne(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer", id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Customer create(@Valid @RequestBody Customer in) {
        in.setId(null);
        return repo.save(in);
    }

    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @Valid @RequestBody Customer in) {
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
