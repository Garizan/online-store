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

    public Author create(Author author) {
        return authorRepository.save(author);
    }

    public Author update(Long id, Author updated) {
        Author author = getById(id);
        if (author == null) {
            throw new RuntimeException("Автор не найден");
        }
        author.setName(updated.getName());
        return authorRepository.save(author);
    }

    public void delete(Long id) {
        authorRepository.deleteById(id);
    }
}

