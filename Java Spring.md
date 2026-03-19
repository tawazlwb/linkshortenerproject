# Plan de révision Java & Spring — Retour en production

> Créé le 19 mars 2026 — Basé sur évaluation technique personnelle

---

## Contexte

- Java depuis 2017 (Spring Boot), puis SAP Commerce 2018–2025 (Spring XML, fonctionnalités isolées)
- Bases Java : Java 8
- Retour sur des projets Java purs avec Spring Boot
- Objectif : maîtriser Java 8 → Java 25 + Spring Boot 3.x moderne

---

## Évaluation de départ

| Thème | Score | Statut |
|---|---|---|
| Java Language Knowledge | 260/560 | Lacune majeure |
| Java Problem Solving | 100/150 | Correct |
| Java Design | 80/80 | Maîtrisé |
| Hibernate Fetching | 0/60 | Critique |
| Hibernate Persistence | 40/40 | Maîtrisé (rouillé) |
| Hibernate Entity | 20/20 | Maîtrisé |
| Spring Language Knowledge | 80/80 | Maîtrisé |
| Spring Boot | 80/80 | Maîtrisé (features récentes à revoir) |
| Spring AOP | 0/60 | Critique |
| Spring Security | 60/60 | Maîtrisé (très rouillé, API changée) |
| Spring Data | 40/40 | Maîtrisé (très rouillé — SAP Commerce) |
| Spring Web | 20/40 | Partiel |
| Spring Core | 20/20 | Maîtrisé |
| SQL — Structure BDD | 0/80 | Critique |
| SQL — Sécurité et intégrité | 60/60 | Maîtrisé |
| SQL — Modification de données | 20/20 | Maîtrisé |

---

## Plan de révision — Thèmes critiques (score 0)

### 1. Hibernate Fetching — 1 semaine

- Lazy vs Eager loading (`FetchType.LAZY` / `FetchType.EAGER`)
- Problème N+1 et solutions : `@BatchSize`, `JOIN FETCH`, `@EntityGraph`
- Fetch joins en JPQL
- Transactions et session Hibernate
- `@Transactional` : propagation, isolation, rollback

---

### 2. Spring AOP — 1 semaine

- Concepts fondamentaux : Aspect, Advice, Pointcut, JoinPoint, Weaving
- Types d'advice : `@Around`, `@Before`, `@After`, `@AfterReturning`, `@AfterThrowing`
- Déclaration de Pointcuts : expressions, wildcards
- Cas d'usage concrets : logging, gestion des transactions, audit, sécurité déclarative
- Proxy JDK vs CGLIB

---

### 3. SQL — Structure de base de données — 1,5 semaine

- Modélisation relationnelle : MCD → MLD
- Normalisation : 1NF, 2NF, 3NF
- Clés primaires, clés étrangères, contraintes (`UNIQUE`, `NOT NULL`, `CHECK`)
- Index : types, stratégies d'optimisation, EXPLAIN PLAN
- Vues, procédures stockées, triggers
- Jointures avancées : `INNER`, `LEFT`, `RIGHT`, `FULL OUTER`, self-join
- Sous-requêtes et CTE (`WITH ... AS`)

---

## Plan de révision — Thèmes rouillés (bons scores mais hors pratique)

### 4. Spring Security 6 — 2 semaines

> **Attention** : l'API a radicalement changé depuis Spring Security 5 → 6. `WebSecurityConfigurerAdapter` est **supprimé**.

- Architecture : `SecurityFilterChain`, `AuthenticationManager`, `AuthenticationProvider`
- Configuration moderne via `@Bean` uniquement :

```java
@Bean
SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/public/**").permitAll()
            .anyRequest().authenticated()
        )
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
        .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
        .build();
}
```

- HTTP Security : `csrf()`, `cors()`, `sessionManagement()`
- Authentification : `UserDetailsService`, `PasswordEncoder` (`BCryptPasswordEncoder`)
- JWT : `OncePerRequestFilter`, `SecurityContextHolder`
- OAuth2 / OpenID Connect : `spring-boot-starter-oauth2-resource-server`, client
- Method Security : `@PreAuthorize`, `@PostAuthorize`, `@Secured`, `@EnableMethodSecurity`
- Tests : `@WithMockUser`, `@WithUserDetails`, `MockMvc` sécurisé

---

### 5. Spring Data JPA — 1,5 semaine

- Repositories : `CrudRepository`, `JpaRepository`, `PagingAndSortingRepository`
- Derived Query Methods : `findByEmailAndActive()`, `findTop3ByOrderByCreatedAtDesc()`
- `@Query` avec JPQL et SQL natif
- Projections : Interface-based, DTO-based (`@Value`, constructeur)
- Specifications (requêtes dynamiques) : `JpaSpecificationExecutor`
- Pagination et tri : `Pageable`, `PageRequest`, `Slice` vs `Page`
- Auditing : `@CreatedDate`, `@LastModifiedDate`, `@EnableJpaAuditing`
- Custom Repository : implémenter une interface personnalisée

---

### 6. Spring Web — 1 semaine

- `@RestController`, `@RequestMapping`, `ResponseEntity`
- `@PathVariable`, `@RequestParam`, `@RequestBody`, `@RequestHeader`
- Gestion globale des exceptions : `@ControllerAdvice`, `@ExceptionHandler`
- Validation : `@Valid`, `@Validated`, `BindingResult`, contraintes Jakarta
- Content negotiation, HATEOAS basique
- Introduction à Spring WebFlux (programmation réactive, `Mono`, `Flux`)

---

### 7. Spring Boot 3.x — 1 semaine

- Auto-configuration : `@EnableAutoConfiguration`, `AutoConfiguration.imports` (remplace `spring.factories`)
- **Migration `javax.*` → `jakarta.*`** (changement majeur Spring Boot 3)
- `@ConfigurationProperties` : binding type-safe
- Profils : `@Profile`, `application-{profil}.yml`
- Actuator : health checks, métriques, endpoints custom
- Testing : `@SpringBootTest`, `@WebMvcTest`, `@DataJpaTest`, Testcontainers
- GraalVM Native Image (aperçu)

---

### 8. Persistence Hibernate — 1 semaine

- Lifecycle des entités : `Transient`, `Managed`, `Detached`, `Removed`
- Caching L1 (Session) vs L2 (`@Cacheable`, Ehcache, Redis), Query Cache
- Héritage : `SINGLE_TABLE`, `JOINED`, `TABLE_PER_CLASS`
- Associations correctement mappées : `@OneToMany`, `@ManyToMany` (éviter les pièges)
- Optimistic Locking : `@Version`
- Hibernate avec Spring Boot 3.x : changements `jakarta.persistence`

---

### 9. Design Java moderne — 1 semaine

- Design Patterns en contexte Spring : Factory, Builder, Strategy, Decorator, Observer
- Nouveaux idiomes Java : Records comme Value Objects, Sealed Classes pour discriminated unions
- Pattern Matching pour le Visitor pattern
- Programmation fonctionnelle : `Function`, `Predicate`, `Supplier`, méthodes par référence, Streams avancés
- Immutabilité : Records + `List.of()`, `Map.of()`, `Set.of()`

---

## Java 8 → Java 25 : Nouveautés à maîtriser

### Java 9 — 10 (2017–2018) — 3 jours

- **Module System (Project Jigsaw)** : `module-info.java`, encapsulation forte
- `var` (inférence de type locale) — Java 10
- Nouvelles méthodes sur collections : `List.of()`, `Set.of()`, `Map.of()`, `Map.copyOf()`
- `Optional` amélioré : `ifPresentOrElse()`, `or()`, `stream()`
- HTTP Client (incubateur → standard en Java 11)

---

### Java 11 (LTS) — 3 jours

- HTTP Client API standard : `HttpClient`, `HttpRequest`, `HttpResponse`
- Nouvelles méthodes `String` : `isBlank()`, `strip()`, `stripLeading()`, `stripTrailing()`, `lines()`, `repeat()`
- Exécution directe de fichiers `.java` sans compilation préalable
- Suppression de JavaEE et CORBA du JDK

---

### Java 14 → 16 (2020–2021) — 1 semaine

- **Records** : `record Point(int x, int y) {}` — immutabilité et lisibilité

```java
record Person(String name, int age) {}
// Génère automatiquement : constructeur, getters, equals, hashCode, toString
```

- **Switch expressions** :

```java
String result = switch (day) {
    case MONDAY, FRIDAY -> "Début/Fin de semaine";
    case SATURDAY, SUNDAY -> "Week-end";
    default -> {
        yield "Milieu de semaine";
    }
};
```

- **Pattern Matching `instanceof`** :

```java
// Avant Java 16
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.length());
}
// Depuis Java 16
if (obj instanceof String s) {
    System.out.println(s.length());
}
```

- **Text Blocks** : JSON/SQL inlinés lisibles

```java
String json = """
        {
            "name": "Alice",
            "age": 30
        }
        """;
```

- **Sealed Classes** (preview) : contrôle de l'héritage

---

### Java 17 (LTS) — 2 jours

> **Prérequis obligatoire pour Spring Boot 3.x**

- **Sealed Classes** (standard) :

```java
sealed interface Shape permits Circle, Rectangle, Triangle {}
record Circle(double radius) implements Shape {}
record Rectangle(double w, double h) implements Shape {}
```

- Pattern Matching switch (preview → standard en 21)
- Strong encapsulation du JDK interne (fin des hacks via réflexion)
- Deprecation RMI Activation, AppletContext

---

### Java 21 (LTS) — 1,5 semaine

> **Version LTS la plus importante depuis Java 8 — priorité haute**

- **Virtual Threads** (Project Loom) — révolution pour les apps web/IO :

```java
// Avant : threads OS coûteux
ExecutorService exec = Executors.newFixedThreadPool(200);

// Java 21 : millions de threads virtuels légers
ExecutorService exec = Executors.newVirtualThreadPerTaskExecutor();
```

- **Record Patterns** — destructuration dans les switch :

```java
double area(Shape s) {
    return switch (s) {
        case Circle(double r) -> Math.PI * r * r;
        case Rectangle(double w, double h) -> w * h;
    };
}
```

- **Pattern Matching switch** (standard) : sur types, records, sealed classes
- **Sequenced Collections** : `getFirst()`, `getLast()`, `reversed()` sur toutes les collections
- **Structured Concurrency** (preview) : gestion propre des tâches concurrentes
- **Scoped Values** (preview) : alternative propre aux `ThreadLocal`

---

### Java 22 → 25 — 1 semaine

- **Unnamed Variables** (`_`) : ignorer explicitement les variables non utilisées

```java
try {
    riskyOperation();
} catch (Exception _) {
    // exception ignorée intentionnellement
}
```

- **Stream Gatherers** (Java 22) : opérations intermédiaires personnalisées sur les streams
- **Scoped Values** (standard en Java 23)
- **Flexible Constructor Bodies** (Java 22) : code avant `super()` dans les constructeurs
- **Project Valhalla** (Java 25) : Value Classes, types primitifs génériques
- Améliorations continues des patterns, records, et performances JVM

---

## Récapitulatif global

| Thème | Durée | Priorité |
|---|---|---|
| Hibernate Fetching (score 0) | 1 semaine | Critique |
| Spring AOP (score 0) | 1 semaine | Critique |
| SQL — Structure BDD (score 0) | 1,5 semaine | Critique |
| Spring Security 6 (rouillé + API changée) | 2 semaines | Haute |
| Spring Data JPA (rouillé — SAP Commerce) | 1,5 semaine | Haute |
| Spring Web (partiel) | 1 semaine | Haute |
| Java 9 → 11 | 1 semaine | Haute |
| Java 14 → 17 (Records, Sealed, Patterns) | 1,5 semaine | Haute |
| Java 21 LTS (Virtual Threads, Patterns avancés) | 1,5 semaine | Haute |
| Spring Boot 3.x (features récentes) | 1 semaine | Moyenne |
| Persistence Hibernate (approfondissement) | 1 semaine | Moyenne |
| Design Java moderne | 1 semaine | Moyenne |
| Java 22 → 25 | 1 semaine | Basse |
| **TOTAL** | **~16 semaines** | |

---

## Ordre de travail recommandé

1. **Java 17** — prérequis Spring Boot 3.x (non négociable)
2. **Spring Boot 3.x + Spring Security 6** — migration `WebSecurityConfigurerAdapter` supprimée
3. **Spring Data JPA + Hibernate Fetching** — très liés, à traiter en parallèle
4. **Java 21** — appliquer les Virtual Threads directement dans les exemples Spring
5. **Spring AOP + Spring Web** — consolider le reste du framework
6. **SQL Structure + Java 22–25** — finalisation

> Avec **2h/jour** de pratique active (petits projets, kata de code), ce plan tient en **12 semaines**.

---

## Formations Udemy Business recommandées

> Toutes ces formations sont accessibles avec ton abonnement Udemy Business sans surcoût.

### 1. Java 8 → Java 25 + Spring Boot 3 — Démarrage immédiat
**[Java 25 Ready: Java 8–25 + Spring Boot 3 - In Simple Terms](https://www.udemy.com/course/ocp11_from_oca8/)**
- Formateur : Dr. Seán Kennedy (OCA, OCP)
- Note : ⭐ 4,6 — 3 059 avis
- Durée : **33,5h** — Intermédiaire
- Couvre : Java 8 → 25 + Spring Boot 3 + quizz style certification OCP

---

### 2. Spring Boot 4 + Spring 7 + Hibernate — Le socle complet
**[Spring Boot 4, Spring 7 & Hibernate for Beginners](https://www.udemy.com/course/spring-hibernate-tutorial/)**
- Formateur : Chad Darby — Meilleure vente
- Note : ⭐ 4,6 — **93 781 avis**
- Durée : **35,5h**
- Couvre : Spring Core, AOP, REST, Spring Security, JPA, Hibernate, Swagger, MVC, MySQL

---

### 3. Spring Security Zero to Master — JWT, OAuth2, Keycloak
**[Spring Security Zero to Master along with JWT, OAUTH2](https://www.udemy.com/course/spring-security-zero-to-master/)**
- Formateur : Eazy Bytes / Madan Reddy — Meilleure vente
- Note : ⭐ 4,6 — **10 599 avis**
- Durée : **24,5h**
- Couvre : Spring Security 6/7, CORS, CSRF, JWT, OAuth2, OpenID Connect, Keycloak, Spring Authorization Server

---

### 4. Spring Data JPA + Hibernate + REST + Docker
**[Master Spring 7, Spring Boot 4, REST, JPA, Security](https://www.udemy.com/course/spring-springboot-jpa-hibernate-zero-to-master/)**
- Formateur : Eazy Bytes / Madan Reddy — Meilleure vente
- Note : ⭐ 4,6 — **6 401 avis**
- Durée : **37h**
- Couvre : Spring Boot, Spring Security, JPA, Hibernate Fetching, REST APIs, Docker, AWS

---

### 5. Spring Boot Testing — JUnit 5, Mockito, Testcontainers
**[Spring Boot Testing with JUnit 5, Mockito & Testcontainers](https://www.udemy.com/course/testing-spring-boot-application-with-junit-and-mockito/)**
- Formateur : Ramesh Fadatare
- Note : ⭐ 4,7 — 1 673 avis
- Durée : **16,5h**
- Couvre : Unit tests, Integration tests, Spring WebFlux, JUnit 5, Mockito, Testcontainers

---

### 6. Spring AOP — Certification Module dédié
**[Spring Professional Certification Exam Tutorial - Module 02 (AOP)](https://www.udemy.com/course/spring-professional-certification-exam-tutorial-module-02/)**
- Formateur : Dominik Cebula
- Note : ⭐ 4,7 — 1 395 avis
- Durée : **1,5h**
- Couvre : Aspect Oriented Programming en profondeur — Aspects, Advice, Pointcut, JoinPoint, Proxy JDK vs CGLIB

> Cours court et très ciblé sur l'AOP. Le cours Chad Darby (#2) couvre également les bases AOP dans un contexte plus large.

---

### 7. Java 21 Virtual Threads + Structured Concurrency — Hands-On
**[Java 25: Virtual Threads, Concurrency Masterclass [Hands-On]](https://www.udemy.com/course/java-virtual-thread/)**
- Formateur : Vinoth Selvaraj
- Note : ⭐ 4,7 — 605 avis
- Durée : **11h** — 122 sessions
- Couvre : Virtual Threads, Structured Concurrency, ExecutorService, ScopedValues, CompletableFuture, scalabilité avec Spring Boot

> Cours pratique avec intégration Spring Boot — exactement ce qu'il faut pour appliquer Java 21 dans un contexte réel.

---

### 8. SQL — Structure de base de données
**[The Complete SQL Bootcamp: Go from Zero to Hero](https://www.udemy.com/course/the-complete-sql-bootcamp/)**
- Formateur : Jose Portilla — Meilleure vente
- Note : ⭐ 4,7 — **30 000+ avis**
- Durée : **9h**
- Couvre : Modélisation, structure BDD, normalisation, index, sous-requêtes, vues, GROUP BY, JOIN, fonctions d'agrégation

---

## Récapitulatif final — Toutes les formations

> **Temps vidéo** = durée brute des cours. **Temps pratique** = codage en parallèle sur IntelliJ (×0,5 pour les notions connues, ×1 pour les notions nouvelles). **Temps total** = temps vidéo + temps pratique.

| # | Formation | Temps vidéo | Temps pratique | Temps total |
|---|---|---|---|---|
| 1 | Java 25 Ready: Java 8–25 + Spring Boot 3 | 33,5h | ~25h | **~58,5h** |
| 2 | Spring Boot 4, Spring 7 & Hibernate (Chad Darby) | 35,5h | ~30h | **~65,5h** |
| 3 | Spring Security Zero to Master | 24,5h | ~25h | **~49,5h** |
| 4 | Master Spring 7, JPA, REST (Eazy Bytes) | 37h | ~30h | **~67h** |
| 5 | Spring Boot Testing (JUnit 5, Mockito) | 16,5h | ~16h | **~32,5h** |
| 6 | Spring AOP — Module certification Dominik Cebula | 1,5h | ~2h | **~3,5h** |
| 7 | Java 25 Virtual Threads Masterclass | 11h | ~11h | **~22h** |
| 8 | The Complete SQL Bootcamp | 9h | ~7h | **~16h** |
| | **TOTAL** | **~168h** | **~146h** | **~314h** |

---

### Estimation de durée selon ton rythme

| Rythme quotidien | Durée estimée (vidéo seule) | Durée estimée (vidéo + pratique ~314h) |
|---|---|---|
| 1h / jour | ~168 jours (~24 semaines) | ~314 jours (~45 semaines) |
| 2h / jour | ~84 jours (~12 semaines) | **~157 jours (~22 semaines)** |
| 3h / jour | ~56 jours (~8 semaines) | ~105 jours (~15 semaines) |
| 8h / jour | ~21 jours (~3 semaines) | **~39 jours (~5-6 semaines)** |

> **Recommandation** : 2h/jour avec pratique active (petits projets en parallèle) = **12 semaines** pour une maîtrise solide et opérationnelle.

---

## Couverture complète des thématiques

| Thème demandé | Couvert ? | Par quelle formation |
|---|---|---|
| Java 8 → Java 25 | ✅ Complet | Formation #1 (Dr. Seán Kennedy) |
| Spring Boot 3.x / 4 | ✅ Complet | Formation #2 (Chad Darby) |
| Hibernate Fetching (score 0) | ✅ Complet | Formation #4 (Eazy Bytes) |
| Spring AOP (score 0) | ✅ Complet | Formation #6 (Dominik Cebula) + #2 |
| SQL Structure BDD (score 0) | ✅ Complet | Formation #8 (SQL Bootcamp) |
| Spring Security 6/7 | ✅ Complet | Formation #3 (Eazy Bytes Security) |
| Spring Data JPA | ✅ Complet | Formation #4 (Eazy Bytes) |
| Spring Web / REST | ✅ Complet | Formation #2 + #4 |
| Java 21 Virtual Threads | ✅ Complet | Formation #7 (Vinoth Selvaraj) |
| Testing JUnit / Mockito | ✅ Complet | Formation #5 |
| Persistence Hibernate | ✅ Complet | Formation #2 + #4 |
| Design Java moderne | ✅ Partiel | Formation #1 (Records, Patterns) |

**Tout est couvert. Aucun manque.**

---

## Comment alléger la durée — 3 leviers concrets

### Levier 1 — Sauter les modules déjà maîtrisés (-40h)

Chaque cours Udemy affiche son plan détaillé. Tu peux **ignorer directement** ces modules :

| Formation | Modules à sauter | Gain estimé |
|---|---|---|
| Chad Darby (#2) | Spring Core / DI / IoC (déjà maîtrisé) | ~6h |
| Eazy Bytes (#4) | Introduction Spring Boot, REST basique | ~5h |
| Eazy Bytes Security (#3) | Authentification basique, formulaires login | ~4h |
| SQL Bootcamp (#8) | SELECT, INSERT, UPDATE basiques (déjà maîtrisé) | ~3h |
| Java 25 Ready (#1) | Java 8 features (lambdas, streams — déjà connus) | ~8h |
| Virtual Threads (#7) | Introduction threading classique | ~2h |
| **Gain total** | | **~28h vidéo → ~40h avec pratique** |

### Levier 2 — Visionner à 1,25x ou 1,5x (-20 à -30h vidéo)

Tous les cours Udemy permettent d'accélérer la vitesse de lecture.

| Vitesse | Économie sur 168h vidéo |
|---|---|
| 1,25x sur tout le contenu | ~34h économisées |
| 1,5x sur les parties connues (~60%) | ~24h économisées |

### Levier 3 — Copilot sur les parties connues (-30 à -40h pratique)

Copilot génère le boilerplate pour les notions déjà maîtrisées. Tu ne codes pas tout toi-même, tu lis et valides.

---

## Bilan allégé réaliste

| Version | Temps total |
|---|---|
| Plan complet brut | ~314h |
| Après modules sautés | ~274h |
| Après vitesse 1,25–1,5x | ~230h |
| Après Copilot sur notions connues | **~190–200h** |

**À 8h/jour : ~4 semaines au lieu de 5-6.**
**À 3h/jour : ~11 semaines au lieu de 15.**

> **Règle d'or** : ne regarde en vitesse normale et sans Copilot que les **3 thèmes critiques** — Hibernate Fetching, Spring AOP, Virtual Threads. Sur tout le reste, accélère sans complexe.
