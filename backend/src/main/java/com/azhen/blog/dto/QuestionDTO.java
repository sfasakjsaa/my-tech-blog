package com.azhen.blog.dto;

import lombok.Data;

@Data
public class QuestionDTO {
    private String categoryId;
    private String title;
    private String content;
    private Boolean isFrequent;
    private String order;
}
