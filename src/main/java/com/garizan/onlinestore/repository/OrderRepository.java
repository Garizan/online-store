package com.garizan.onlinestore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.garizan.onlinestore.model.Order;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Long customerId);
}
