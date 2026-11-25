package com.example.erp.controller;

import com.example.erp.exception.ResourceNotFoundException;
import com.example.erp.model.Employee;
import com.example.erp.repository.DepartmentRepository;
import com.example.erp.repository.EmployeeRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository repo;
    private final DepartmentRepository departments;

    public EmployeeController(EmployeeRepository repo, DepartmentRepository departments) {
        this.repo = repo;
        this.departments = departments;
    }

    @GetMapping
    public List<Employee> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Employee getOne(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee", id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Employee create(@Valid @RequestBody Employee in) {
        in.setId(null);
        resolveDepartment(in);
        return repo.save(in);
    }

    @PutMapping("/{id}")
    public Employee update(@PathVariable Long id, @Valid @RequestBody Employee in) {
        getOne(id);
        in.setId(id);
        resolveDepartment(in);
        return repo.save(in);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repo.delete(getOne(id));
    }

    /** The client sends {"department": {"id": 1}}; load the full department (or clear it). */
    private void resolveDepartment(Employee e) {
        if (e.getDepartment() != null && e.getDepartment().getId() != null) {
            Long depId = e.getDepartment().getId();
            e.setDepartment(departments.findById(depId)
                    .orElseThrow(() -> new ResourceNotFoundException("Department", depId)));
        } else {
            e.setDepartment(null);
        }
    }
}
