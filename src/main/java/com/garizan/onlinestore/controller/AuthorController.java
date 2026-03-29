package com.garizan.onlinestore.controller;

import com.garizan.onlinestore.model.Author;
import com.garizan.onlinestore.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/authors")
public class AuthorController {

    private final AuthorService authorService;

    @GetMapping
    public List<Author> getAll() {
        return authorService.getAll();
    }

    @GetMapping("/{id}")
    public Author getById(@PathVariable Long id) {
        return authorService.getById(id);
    }

    @PostMapping
    public Author create(@RequestBody Author author) {
        return authorService.create(author);
    }

    @PutMapping("/{id}")
    public Author update(@PathVariable  Long id, @RequestBody Author author) {
        return authorService.update(id, author);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        authorService.delete(id);
    }
}