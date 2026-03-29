package com.garizan.onlinestore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.garizan.onlinestore.model.Order;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
}
