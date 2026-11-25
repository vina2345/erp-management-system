package com.example.erp.controller;

import com.example.erp.exception.ResourceNotFoundException;
import com.example.erp.model.Department;
import com.example.erp.repository.DepartmentRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentRepository repo;

    public DepartmentController(DepartmentRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Department> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Department getOne(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Department", id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Department create(@Valid @RequestBody Department in) {
        in.setId(null);
        return repo.save(in);
    }

    @PutMapping("/{id}")
    public Department update(@PathVariable Long id, @Valid @RequestBody Department in) {
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
