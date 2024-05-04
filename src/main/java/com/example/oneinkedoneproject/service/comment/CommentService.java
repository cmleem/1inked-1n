package com.example.oneinkedoneproject.service.comment;

import com.example.oneinkedoneproject.domain.Article;
import com.example.oneinkedoneproject.domain.Comment;
import com.example.oneinkedoneproject.domain.User;
import com.example.oneinkedoneproject.dto.AddCommentRequestDto;
import com.example.oneinkedoneproject.dto.UpdateCommentRequestDto;
import com.example.oneinkedoneproject.repository.article.ArticleRepository;
import com.example.oneinkedoneproject.repository.comment.CommentRepository;
import com.example.oneinkedoneproject.repository.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;

    public Comment save(User user, String articleId, AddCommentRequestDto request) {
        Article article = articleRepository.findById(articleId).orElseThrow(() -> new IllegalArgumentException("not found: " + articleId));
        String parentId = request.getParentId();
        Comment parentComment = null;
        if (parentId != null) 
            parentComment = commentRepository.findById(parentId).orElseThrow(() -> new IllegalArgumentException("not found: " + parentId));
        Comment comment = request.toEntity(user, article, parentComment);
        if (parentId != null)
        	comment.getReplyList().add(comment);

        return commentRepository.save(comment);
    }

    
    public List<Comment> getComments(String articleId) {
        Article article = articleRepository.findById(articleId).orElseThrow(() -> new IllegalArgumentException("not found: " + articleId));
        return article.getCommentList();
    }

    @Transactional
    public Comment updateComment(String commentId, UpdateCommentRequestDto request) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new IllegalArgumentException("not found: " + commentId));

        comment.update(request.getComments());
        return comment;
    }

    public void deleteComment(String commentId) {
        commentRepository.deleteById(commentId);
    }
}