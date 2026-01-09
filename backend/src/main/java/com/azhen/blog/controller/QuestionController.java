package com.azhen.blog.controller;

import com.azhen.blog.dto.ApiResponse;
import com.azhen.blog.dto.QuestionDTO;
import com.azhen.blog.entity.Question;
import com.azhen.blog.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Question>>> getQuestions(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String search) {
        List<Question> questions = questionService.getQuestions(categoryId, search);
        return ResponseEntity.ok(ApiResponse.success(questions));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Question>> createQuestion(@RequestBody QuestionDTO questionDTO) {
        try {
            Question question = questionService.createQuestion(questionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(question));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to create question"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Question>> updateQuestion(
            @PathVariable String id,
            @RequestBody QuestionDTO questionDTO) {
        Optional<Question> question = questionService.updateQuestion(id, questionDTO);
        if (question.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(question.get()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error("Question not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable String id) {
        boolean success = questionService.deleteQuestion(id);
        if (success) {
            return ResponseEntity.ok(ApiResponse.success(null));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error("Question not found"));
    }
}
