package com.garizan.onlinestore.service;

import lombok.RequiredArgsConstructor;
import com.garizan.onlinestore.model.Author;
import com.garizan.onlinestore.repository.AuthorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    public List<Author> getAll() {
        return authorRepository.findAll();
    }

    public Author getById(Long id) {
        return authorRepository.findById(id).orElse(null);
    }

    public List<Author> searchByName(String name) {
        if (name == null || name.isBlank()) return authorRepository.findAll();
        return authorRepository.findByNameContainingIgnoreCase(name.trim());
    }
}

