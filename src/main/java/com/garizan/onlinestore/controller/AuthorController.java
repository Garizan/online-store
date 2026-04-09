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

    @GetMapping("/search")
    public List<Author> search(@RequestParam String name) {
        return authorService.searchByName(name);
    }
}