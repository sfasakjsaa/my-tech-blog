package com.azhen.blog.service;

import com.azhen.blog.dto.QuestionDTO;
import com.azhen.blog.entity.Question;
import com.azhen.blog.repository.CategoryRepository;
import com.azhen.blog.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final CategoryRepository categoryRepository;

    public List<Question> getQuestions(String categoryId, String search) {
        // 如果提供了 categoryId 但不是 "all"，则按 categoryId 过滤
        if (categoryId != null && !categoryId.isEmpty() && !categoryId.equals("all")) {
            return questionRepository.findByCategoryIdOrderByOrderAscCreatedAtDesc(categoryId);
        }
        // 否则使用搜索过滤
        return questionRepository.findWithFilters(
            (categoryId != null && !categoryId.isEmpty() && !categoryId.equals("all")) ? categoryId : null,
            search
        );
    }

    public Optional<Question> getQuestionById(String id) {
        return questionRepository.findById(id);
    }

    @Transactional
    public Question createQuestion(QuestionDTO questionDTO) {
        // 验证分类是否存在
        if (!categoryRepository.existsById(questionDTO.getCategoryId())) {
            throw new IllegalArgumentException("Category not found: " + questionDTO.getCategoryId());
        }

        // 获取该分类下的最大 order 值
        List<Question> questions = questionRepository.findByCategoryIdOrderByOrderAscCreatedAtDesc(questionDTO.getCategoryId());
        String maxOrder = questions.stream()
            .map(Question::getOrder)
            .max((o1, o2) -> {
                try {
                    return Integer.compare(Integer.parseInt(o1), Integer.parseInt(o2));
                } catch (NumberFormatException e) {
                    return 0;
                }
            })
            .orElse("0");

        String newOrder = String.valueOf(Integer.parseInt(maxOrder) + 1);

        Question question = new Question();
        question.setCategoryId(questionDTO.getCategoryId());
        question.setTitle(questionDTO.getTitle());
        question.setContent(questionDTO.getContent());
        question.setIsFrequent(questionDTO.getIsFrequent() != null ? questionDTO.getIsFrequent() : false);
        question.setOrder(newOrder);
        question.setCreatedAt(LocalDateTime.now());
        return questionRepository.save(question);
    }

    @Transactional
    public Optional<Question> updateQuestion(String id, QuestionDTO questionDTO) {
        return questionRepository.findById(id).map(question -> {
            if (questionDTO.getCategoryId() != null) {
                question.setCategoryId(questionDTO.getCategoryId());
            }
            if (questionDTO.getTitle() != null) {
                question.setTitle(questionDTO.getTitle());
            }
            if (questionDTO.getContent() != null) {
                question.setContent(questionDTO.getContent());
            }
            if (questionDTO.getIsFrequent() != null) {
                question.setIsFrequent(questionDTO.getIsFrequent());
            }
            if (questionDTO.getOrder() != null) {
                question.setOrder(questionDTO.getOrder());
            }
            question.setUpdatedAt(LocalDateTime.now());
            return questionRepository.save(question);
        });
    }

    @Transactional
    public boolean deleteQuestion(String id) {
        if (questionRepository.existsById(id)) {
            questionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
