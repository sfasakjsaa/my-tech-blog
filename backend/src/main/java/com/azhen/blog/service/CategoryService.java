package com.azhen.blog.service;

import com.azhen.blog.dto.CategoryDTO;
import com.azhen.blog.entity.Category;
import com.azhen.blog.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAllByOrderByOrderAsc();
    }

    @Transactional
    public Category createCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setOrder(categoryDTO.getOrder() != null ? categoryDTO.getOrder() : "0");
        category.setCreatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }

    @Transactional
    public Optional<Category> updateCategory(String id, CategoryDTO categoryDTO) {
        return categoryRepository.findById(id).map(category -> {
            if (categoryDTO.getName() != null) {
                category.setName(categoryDTO.getName());
            }
            if (categoryDTO.getOrder() != null) {
                category.setOrder(categoryDTO.getOrder());
            }
            return categoryRepository.save(category);
        });
    }

    @Transactional
    public boolean deleteCategory(String id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
