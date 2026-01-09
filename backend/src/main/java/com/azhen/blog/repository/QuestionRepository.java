package com.azhen.blog.repository;

import com.azhen.blog.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {
    List<Question> findByCategoryIdOrderByOrderAscCreatedAtDesc(String categoryId);

    @Query("SELECT q FROM Question q WHERE " +
           "(:categoryId IS NULL OR q.categoryId = :categoryId) AND " +
           "(:search IS NULL OR q.title LIKE %:search% OR q.content LIKE %:search%) " +
           "ORDER BY q.order ASC, q.createdAt DESC")
    List<Question> findWithFilters(@Param("categoryId") String categoryId,
                                    @Param("search") String search);
}
