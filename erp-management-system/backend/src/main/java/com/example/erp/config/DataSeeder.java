package com.example.erp.config;

import com.example.erp.model.*;
import com.example.erp.repository.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/** Inserts demo data once, when the database is empty. */
@Component
public class DataSeeder implements CommandLineRunner {

    private final DepartmentRepository departments;
    private final EmployeeRepository employees;
    private final CustomerRepository customers;
    private final ProductRepository products;

    public DataSeeder(DepartmentRepository d, EmployeeRepository e, CustomerRepository c, ProductRepository p) {
        this.departments = d; this.employees = e; this.customers = c; this.products = p;
    }

    @Override
    public void run(String... args) {
        if (departments.count() > 0) return;

        Department eng = departments.save(new Department("Engineering", "Software and IT"));
        Department sales = departments.save(new Department("Sales", "Sales and account management"));
        Department hr = departments.save(new Department("Human Resources", "People operations"));

        employees.save(emp("Ravina", "Gadre", "ravina@erp.com", "Software Engineer", "65000", eng));
        employees.save(emp("Amit", "Kulkarni", "amit@erp.com", "Sales Manager", "55000", sales));
        employees.save(emp("Neha", "Joshi", "neha@erp.com", "HR Executive", "42000", hr));

        customers.save(new Customer("Asha Patil", "asha@example.com", "9876543210", "Pune"));
        customers.save(new Customer("Rohan Mehta", "rohan@example.com", "9123456780", "Mumbai"));
        customers.save(new Customer("Priya Nair", "priya@example.com", "9988776655", "Bengaluru"));

        products.save(new Product("Wireless Mouse", "WM-100", "Accessories", new BigDecimal("799.00"), 50, 10));
        products.save(new Product("Mechanical Keyboard", "KB-200", "Accessories", new BigDecimal("2499.00"), 8, 10));
        products.save(new Product("27-inch Monitor", "MN-270", "Displays", new BigDecimal("14999.00"), 20, 5));
        products.save(new Product("USB-C Hub", "HB-300", "Accessories", new BigDecimal("1299.00"), 4, 8));
    }

    private Employee emp(String f, String l, String email, String title, String salary, Department d) {
        Employee e = new Employee();
        e.setFirstName(f); e.setLastName(l); e.setEmail(email); e.setJobTitle(title);
        e.setSalary(new BigDecimal(salary)); e.setHireDate(LocalDate.now().minusYears(1)); e.setDepartment(d);
        return e;
    }
}
