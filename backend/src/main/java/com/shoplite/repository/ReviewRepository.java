package com.shoplite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shoplite.entity.Product;
import com.shoplite.entity.Review;
import com.shoplite.entity.User;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductOrderByCreatedAtDesc(Product product);

    boolean existsByProductAndUser(Product product, User user);

    long countByProduct(Product product);

    @Query("select avg(r.rating) from Review r where r.product = :product")
    Double findAverageRatingForProduct(@Param("product") Product product);
}
