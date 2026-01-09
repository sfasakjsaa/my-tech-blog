package com.azhen.blog.controller;

import com.azhen.blog.dto.ApiResponse;
import com.azhen.blog.dto.CategoryDTO;
import com.azhen.blog.entity.Category;
import com.azhen.blog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody CategoryDTO categoryDTO) {
        try {
            Category category = categoryService.createCategory(categoryDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(category));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to create category"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable String id,
            @RequestBody CategoryDTO categoryDTO) {
        Optional<Category> category = categoryService.updateCategory(id, categoryDTO);
        if (category.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(category.get()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error("Category not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable String id) {
        boolean success = categoryService.deleteCategory(id);
        if (success) {
            return ResponseEntity.ok(ApiResponse.success(null));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error("Category not found"));
    }
}
