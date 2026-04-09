package com.garizan.onlinestore.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    // Сгенерируй свой ключ позже, этот пока рабочий (>= 256 бит)
    private static final String SECRET_B64 =
            "N2Q4YzA5ZWY4OGQ2N2M2Y2U4NTY4ODZmM2EwZmU5M2Q1Y2RlY2Q2ZTQwY2UyOTQ0YjE5YjQ2YjVlY2Q4YQ==";

    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000L;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_B64));
    }

    public String generateToken(String email) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + EXPIRATION_MS);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
