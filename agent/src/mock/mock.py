def obter_candidatos_mock():
    return [
        # ================= BACKEND_DEVELOPER (10) =================
        {
            "candidato_id": "b1a2c3d4-0001-4000-8000-000000000001", "nome": "Raquel Silva", "score_match": 76, "badge_diversidade": ["NEGRO", "LGBTQIA+"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["2 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 78"], "motivos": ["2 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 78"], 
            "skills": ["Node.js", "Express", "MongoDB"], "cargoDesejado": "BACKEND_DEVELOPER"
        },
        {
            "candidato_id": "b1a2c3d4-0002-4000-8000-000000000002", "nome": "Thiago Costa", "score_match": 85, "badge_diversidade": ["PCD"], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 90"], "motivos": ["3 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 90"], 
            "skills": ["Python", "FastAPI", "PostgreSQL"], "cargoDesejado": "BACKEND_DEVELOPER"
        },
        {
            "candidato_id": "b1a2c3d4-0003-4000-8000-000000000003", "nome": "Amanda Souza", "score_match": 60, "badge_diversidade": ["MULHER"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["1 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 65"], "motivos": ["1 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 65"], 
            "skills": ["Java", "Spring Boot"], "cargoDesejado": "BACKEND_DEVELOPER"
        },
        {
            "candidato_id": "b1a2c3d4-0004-4000-8000-000000000004", "nome": "Marcos Lima", "score_match": 92, "badge_diversidade": [], "destaque": "SKILLS_COMPATIVEIS", 
            "explicacao": ["3 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 95"], "motivos": ["3 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 95"], 
            "skills": ["C#", ".NET", "SQL Server"], "cargoDesejado": "BACKEND_DEVELOPER"
        },
        {
            "candidato_id": "b1a2c3d4-0005-4000-8000-000000000005", "nome": "Fernanda Gomes", "score_match": 78, "badge_diversidade": ["MULHER", "NEGRO"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["2 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 80"], "motivos": ["2 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 80"], 
            "skills": ["Go", "Docker", "PostgreSQL"], "cargoDesejado": "BACKEND_DEVELOPER"
        },
        {
            "candidato_id": "b1a2c3d4-0006-4000-8000-000000000006", "nome": "Roberto Alves", "score_match": 88, "badge_diversidade": ["50+"], "destaque": "EXPERIENCIA_SOLIDA", 
            "explicacao": ["3 de 3 skills encontradas", "Nivel acima", "Cargo compativel", "Score de mobilidade: 85"], "motivos": ["3 de 3 skills encontradas", "Nivel acima", "Cargo compativel", "Score de mobilidade: 85"], 
            "skills": ["Node.js", "NestJS", "MySQL"], "cargoDesejado": "BACKEND_DEVELOPER"
        },
        {
            "candidato_id": "b1a2c3d4-0007-4000-8000-000000000007", "nome": "Juliana Castro", "score_match": 71, "badge_diversidade": ["LGBTQIA+"], "destaque": "BOM_SCORE_GERAL", 
            "explicacao": ["2 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 70"], "motivos": ["2 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 70"], 
            "skills": ["Python", "Django", "Redis"], "cargoDesejado": "BACKEND_DEVELOPER"
        },
        {
            "candidato_id": "b1a2c3d4-0008-4000-8000-000000000008", "nome": "Carlos Rocha", "score_match": 65, "badge_diversidade": ["NEURODIVERGENTE"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["1 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 60"], "motivos": ["1 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 60"], 
            "skills": ["Ruby", "Ruby on Rails"], "cargoDesejado": "BACKEND_DEVELOPER"
        },
        {
            "candidato_id": "b1a2c3d4-0009-4000-8000-000000000009", "nome": "Beatriz Martins", "score_match": 95, "badge_diversidade": ["MULHER"], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 98"], "motivos": ["3 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 98"], 
            "skills": ["Java", "Spring", "Microservicos"], "cargoDesejado": "BACKEND_DEVELOPER"
        },
        {
            "candidato_id": "b1a2c3d4-0010-4000-8000-000000000010", "nome": "Diego Fernandes", "score_match": 81, "badge_diversidade": [], "destaque": "SKILLS_COMPATIVEIS", 
            "explicacao": ["2 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 82"], "motivos": ["2 de 3 skills encontradas", "Nivel compativel", "Cargo compativel", "Score de mobilidade: 82"], 
            "skills": ["PHP", "Laravel", "MySQL"], "cargoDesejado": "BACKEND_DEVELOPER"
        },

        # ================= MOBILE_DEVELOPER (10) =================
        {
            "candidato_id": "m1a2c3d4-0001-4000-8000-000000000001", "nome": "Lucas Pereira", "score_match": 89, "badge_diversidade": ["NEGRO"], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills", "Nivel compativel", "Cargo compativel"], "motivos": ["3 de 3 skills", "Nivel compativel", "Cargo compativel"], 
            "skills": ["Flutter", "Dart", "Firebase"], "cargoDesejado": "MOBILE_DEVELOPER"
        },
        {
            "candidato_id": "m1a2c3d4-0002-4000-8000-000000000002", "nome": "Camila Oliveira", "score_match": 75, "badge_diversidade": ["MULHER", "LGBTQIA+"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["2 de 3 skills", "Nivel compativel", "Cargo compativel"], "motivos": ["2 de 3 skills", "Nivel compativel", "Cargo compativel"], 
            "skills": ["React Native", "JavaScript"], "cargoDesejado": "MOBILE_DEVELOPER"
        },
        {
            "candidato_id": "m1a2c3d4-0003-4000-8000-000000000003", "nome": "João Santos", "score_match": 94, "badge_diversidade": [], "destaque": "SKILLS_COMPATIVEIS", 
            "explicacao": ["3 de 3 skills", "Nivel compativel", "Cargo compativel"], "motivos": ["3 de 3 skills", "Nivel compativel", "Cargo compativel"], 
            "skills": ["Swift", "iOS", "CoreData"], "cargoDesejado": "MOBILE_DEVELOPER"
        },
        {
            "candidato_id": "m1a2c3d4-0004-4000-8000-000000000004", "nome": "Ana Ribeiro", "score_match": 68, "badge_diversidade": ["MULHER", "PCD"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["1 de 3 skills", "Nivel compativel", "Cargo compativel"], "motivos": ["1 de 3 skills", "Nivel compativel", "Cargo compativel"], 
            "skills": ["Kotlin", "Android Studio"], "cargoDesejado": "MOBILE_DEVELOPER"
        },
        {
            "candidato_id": "m1a2c3d4-0005-4000-8000-000000000005", "nome": "Pedro Carvalho", "score_match": 82, "badge_diversidade": ["NEURODIVERGENTE"], "destaque": "BOM_SCORE_GERAL", 
            "explicacao": ["2 de 3 skills", "Nivel compativel", "Cargo compativel"], "motivos": ["2 de 3 skills", "Nivel compativel", "Cargo compativel"], 
            "skills": ["Flutter", "Dart", "SQLite"], "cargoDesejado": "MOBILE_DEVELOPER"
        },
        {
            "candidato_id": "m1a2c3d4-0006-4000-8000-000000000006", "nome": "Sofia Almeida", "score_match": 91, "badge_diversidade": ["MULHER"], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills", "Nivel compativel", "Cargo compativel"], "motivos": ["3 de 3 skills", "Nivel compativel", "Cargo compativel"], 
            "skills": ["React Native", "TypeScript", "Redux"], "cargoDesejado": "MOBILE_DEVELOPER"
        },
        {
            "candidato_id": "m1a2c3d4-0007-4000-8000-000000000007", "nome": "Bruno Martins", "score_match": 62, "badge_diversidade": ["50+"], "destaque": "EXPERIENCIA_SOLIDA", 
            "explicacao": ["1 de 3 skills", "Nivel acima", "Cargo compativel"], "motivos": ["1 de 3 skills", "Nivel acima", "Cargo compativel"], 
            "skills": ["Java", "Android Studio"], "cargoDesejado": "MOBILE_DEVELOPER"
        },
        {
            "candidato_id": "m1a2c3d4-0008-4000-8000-000000000008", "nome": "Leticia Ferreira", "score_match": 77, "badge_diversidade": ["LGBTQIA+"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["2 de 3 skills", "Nivel compativel", "Cargo compativel"], "motivos": ["2 de 3 skills", "Nivel compativel", "Cargo compativel"], 
            "skills": ["Swift", "Objective-C"], "cargoDesejado": "MOBILE_DEVELOPER"
        },
        {
            "candidato_id": "m1a2c3d4-0009-4000-8000-000000000009", "nome": "Gabriel Pinto", "score_match": 86, "badge_diversidade": ["NEGRO"], "destaque": "BOM_SCORE_GERAL", 
            "explicacao": ["3 de 3 skills", "Nivel compativel", "Cargo compativel"], "motivos": ["3 de 3 skills", "Nivel compativel", "Cargo compativel"], 
            "skills": ["Kotlin", "Jetpack Compose", "Coroutines"], "cargoDesejado": "MOBILE_DEVELOPER"
        },
        {
            "candidato_id": "m1a2c3d4-0010-4000-8000-000000000010", "nome": "Mariana Dias", "score_match": 79, "badge_diversidade": ["MULHER"], "destaque": "SKILLS_COMPATIVEIS", 
            "explicacao": ["2 de 3 skills", "Nivel compativel", "Cargo compativel"], "motivos": ["2 de 3 skills", "Nivel compativel", "Cargo compativel"], 
            "skills": ["Flutter", "Provider", "Firebase"], "cargoDesejado": "MOBILE_DEVELOPER"
        },

        # ================= DEVOPS_ENGINEER (10) =================
        {
            "candidato_id": "d1a2c3d4-0001-4000-8000-000000000001", "nome": "Rafael Correia", "score_match": 88, "badge_diversidade": [], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Docker", "Kubernetes", "AWS"], "cargoDesejado": "DEVOPS_ENGINEER"
        },
        {
            "candidato_id": "d1a2c3d4-0002-4000-8000-000000000002", "nome": "Carla Mendes", "score_match": 95, "badge_diversidade": ["MULHER", "NEGRO"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Terraform", "CI/CD", "GCP"], "cargoDesejado": "DEVOPS_ENGINEER"
        },
        {
            "candidato_id": "d1a2c3d4-0003-4000-8000-000000000003", "nome": "Igor Santos", "score_match": 72, "badge_diversidade": ["LGBTQIA+"], "destaque": "BOM_SCORE_GERAL", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["Linux", "Bash", "Docker"], "cargoDesejado": "DEVOPS_ENGINEER"
        },
        {
            "candidato_id": "d1a2c3d4-0004-4000-8000-000000000004", "nome": "Luiza Silva", "score_match": 84, "badge_diversidade": ["MULHER", "PCD"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["AWS", "CloudFormation", "Python"], "cargoDesejado": "DEVOPS_ENGINEER"
        },
        {
            "candidato_id": "d1a2c3d4-0005-4000-8000-000000000005", "nome": "Fernando Souza", "score_match": 66, "badge_diversidade": ["50+"], "destaque": "EXPERIENCIA_SOLIDA", 
            "explicacao": ["1 de 3 skills", "Nivel acima"], "motivos": ["1 de 3 skills", "Nivel acima"], 
            "skills": ["Jenkins", "Ansible"], "cargoDesejado": "DEVOPS_ENGINEER"
        },
        {
            "candidato_id": "d1a2c3d4-0006-4000-8000-000000000006", "nome": "Aline Costa", "score_match": 91, "badge_diversidade": ["MULHER"], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Kubernetes", "Helm", "Azure"], "cargoDesejado": "DEVOPS_ENGINEER"
        },
        {
            "candidato_id": "d1a2c3d4-0007-4000-8000-000000000007", "nome": "Vitor Oliveira", "score_match": 79, "badge_diversidade": ["NEGRO"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["GitLab CI", "Docker", "Prometheus"], "cargoDesejado": "DEVOPS_ENGINEER"
        },
        {
            "candidato_id": "d1a2c3d4-0008-4000-8000-000000000008", "nome": "Patricia Lima", "score_match": 87, "badge_diversidade": ["MULHER", "NEURODIVERGENTE"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Terraform", "AWS", "Datadog"], "cargoDesejado": "DEVOPS_ENGINEER"
        },
        {
            "candidato_id": "d1a2c3d4-0009-4000-8000-000000000009", "nome": "Rodrigo Alves", "score_match": 73, "badge_diversidade": [], "destaque": "SKILLS_COMPATIVEIS", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["Linux", "Nginx", "Docker"], "cargoDesejado": "DEVOPS_ENGINEER"
        },
        {
            "candidato_id": "d1a2c3d4-0010-4000-8000-000000000010", "nome": "Marina Ribeiro", "score_match": 93, "badge_diversidade": ["MULHER"], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Kubernetes", "ArgoCD", "AWS"], "cargoDesejado": "DEVOPS_ENGINEER"
        },

        # ================= FRONTEND_DEVELOPER (10) =================
        {
            "candidato_id": "f1a2c3d4-0001-4000-8000-000000000001", "nome": "Matheus Silva", "score_match": 90, "badge_diversidade": [], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["React", "TypeScript", "Tailwind"], "cargoDesejado": "FRONTEND_DEVELOPER"
        },
        {
            "candidato_id": "f1a2c3d4-0002-4000-8000-000000000002", "nome": "Julia Ferreira", "score_match": 82, "badge_diversidade": ["MULHER", "NEGRO"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["Vue.js", "JavaScript", "SASS"], "cargoDesejado": "FRONTEND_DEVELOPER"
        },
        {
            "candidato_id": "f1a2c3d4-0003-4000-8000-000000000003", "nome": "Leonardo Costa", "score_match": 74, "badge_diversidade": ["LGBTQIA+"], "destaque": "BOM_SCORE_GERAL", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["Angular", "TypeScript"], "cargoDesejado": "FRONTEND_DEVELOPER"
        },
        {
            "candidato_id": "f1a2c3d4-0004-4000-8000-000000000004", "nome": "Vanessa Martins", "score_match": 96, "badge_diversidade": ["MULHER", "PCD"], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Next.js", "React", "Styled Components"], "cargoDesejado": "FRONTEND_DEVELOPER"
        },
        {
            "candidato_id": "f1a2c3d4-0005-4000-8000-000000000005", "nome": "Henrique Almeida", "score_match": 69, "badge_diversidade": ["50+"], "destaque": "EXPERIENCIA_SOLIDA", 
            "explicacao": ["1 de 3 skills", "Nivel acima"], "motivos": ["1 de 3 skills", "Nivel acima"], 
            "skills": ["HTML5", "CSS3", "JavaScript"], "cargoDesejado": "FRONTEND_DEVELOPER"
        },
        {
            "candidato_id": "f1a2c3d4-0006-4000-8000-000000000006", "nome": "Natalia Gomes", "score_match": 85, "badge_diversidade": ["MULHER"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["React", "Redux", "Jest"], "cargoDesejado": "FRONTEND_DEVELOPER"
        },
        {
            "candidato_id": "f1a2c3d4-0007-4000-8000-000000000007", "nome": "Eduardo Rocha", "score_match": 78, "badge_diversidade": ["NEURODIVERGENTE"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["Vue.js", "Nuxt.js", "Tailwind"], "cargoDesejado": "FRONTEND_DEVELOPER"
        },
        {
            "candidato_id": "f1a2c3d4-0008-4000-8000-000000000008", "nome": "Carolina Souza", "score_match": 91, "badge_diversidade": ["MULHER", "LGBTQIA+"], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Angular", "RxJS", "SCSS"], "cargoDesejado": "FRONTEND_DEVELOPER"
        },
        {
            "candidato_id": "f1a2c3d4-0009-4000-8000-000000000009", "nome": "Felipe Dias", "score_match": 80, "badge_diversidade": ["NEGRO"], "destaque": "BOM_SCORE_GERAL", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["React", "Material-UI", "GraphQL"], "cargoDesejado": "FRONTEND_DEVELOPER"
        },
        {
            "candidato_id": "f1a2c3d4-0010-4000-8000-000000000010", "nome": "Isabela Castro", "score_match": 88, "badge_diversidade": ["MULHER"], "destaque": "SKILLS_COMPATIVEIS", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Svelte", "JavaScript", "CSS"], "cargoDesejado": "FRONTEND_DEVELOPER"
        },

        # ================= UX_DESIGNER (10) =================
        {
            "candidato_id": "u1a2c3d4-0001-4000-8000-000000000001", "nome": "Alice Moura", "score_match": 85, "badge_diversidade": ["MULHER"], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Figma", "User Research", "Prototipagem"], "cargoDesejado": "UX_DESIGNER"
        },
        {
            "candidato_id": "u1a2c3d4-0002-4000-8000-000000000002", "nome": "Gustavo Lima", "score_match": 76, "badge_diversidade": ["LGBTQIA+"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["Adobe XD", "Wireframing"], "cargoDesejado": "UX_DESIGNER"
        },
        {
            "candidato_id": "u1a2c3d4-0003-4000-8000-000000000003", "nome": "Larissa Silva", "score_match": 92, "badge_diversidade": ["MULHER", "NEGRO"], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Figma", "Design System", "UI Design"], "cargoDesejado": "UX_DESIGNER"
        },
        {
            "candidato_id": "u1a2c3d4-0004-4000-8000-000000000004", "nome": "Daniel Costa", "score_match": 68, "badge_diversidade": ["50+"], "destaque": "EXPERIENCIA_SOLIDA", 
            "explicacao": ["1 de 3 skills", "Nivel acima"], "motivos": ["1 de 3 skills", "Nivel acima"], 
            "skills": ["Sketch", "InVision"], "cargoDesejado": "UX_DESIGNER"
        },
        {
            "candidato_id": "u1a2c3d4-0005-4000-8000-000000000005", "nome": "Bruna Alves", "score_match": 88, "badge_diversidade": ["MULHER", "PCD"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Figma", "Teste de Usabilidade", "Miro"], "cargoDesejado": "UX_DESIGNER"
        },
        {
            "candidato_id": "u1a2c3d4-0006-4000-8000-000000000006", "nome": "Renan Oliveira", "score_match": 79, "badge_diversidade": ["NEURODIVERGENTE"], "destaque": "BOM_SCORE_GERAL", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["Figma", "Arquitetura da Informação"], "cargoDesejado": "UX_DESIGNER"
        },
        {
            "candidato_id": "u1a2c3d4-0007-4000-8000-000000000007", "nome": "Tatiana Santos", "score_match": 95, "badge_diversidade": ["MULHER"], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Figma", "Design Thinking", "User Research"], "cargoDesejado": "UX_DESIGNER"
        },
        {
            "candidato_id": "u1a2c3d4-0008-4000-8000-000000000008", "nome": "Marcio Ferreira", "score_match": 73, "badge_diversidade": ["NEGRO"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["Adobe XD", "Prototipagem"], "cargoDesejado": "UX_DESIGNER"
        },
        {
            "candidato_id": "u1a2c3d4-0009-4000-8000-000000000009", "nome": "Camila Castro", "score_match": 84, "badge_diversidade": ["MULHER", "LGBTQIA+"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["Figma", "UI Design", "Principle"], "cargoDesejado": "UX_DESIGNER"
        },
        {
            "candidato_id": "u1a2c3d4-0010-4000-8000-000000000010", "nome": "Vinicius Souza", "score_match": 81, "badge_diversidade": [], "destaque": "SKILLS_COMPATIVEIS", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["Framer", "Figma"], "cargoDesejado": "UX_DESIGNER"
        },

        # ================= DATA_ANALYST (10) =================
        {
            "candidato_id": "a1a2c3d4-0001-4000-8000-000000000001", "nome": "Ricardo Pereira", "score_match": 87, "badge_diversidade": ["NEGRO"], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Python", "SQL", "Power BI"], "cargoDesejado": "DATA_ANALYST"
        },
        {
            "candidato_id": "a1a2c3d4-0002-4000-8000-000000000002", "nome": "Marta Silva", "score_match": 93, "badge_diversidade": ["MULHER", "50+"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Tableau", "SQL", "Excel Avançado"], "cargoDesejado": "DATA_ANALYST"
        },
        {
            "candidato_id": "a1a2c3d4-0003-4000-8000-000000000003", "nome": "André Costa", "score_match": 75, "badge_diversidade": ["LGBTQIA+"], "destaque": "BOM_SCORE_GERAL", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["Python", "Pandas", "Matplotlib"], "cargoDesejado": "DATA_ANALYST"
        },
        {
            "candidato_id": "a1a2c3d4-0004-4000-8000-000000000004", "nome": "Paula Lima", "score_match": 89, "badge_diversidade": ["MULHER", "PCD"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["R", "SQL", "Power BI"], "cargoDesejado": "DATA_ANALYST"
        },
        {
            "candidato_id": "a1a2c3d4-0005-4000-8000-000000000005", "nome": "Tiago Almeida", "score_match": 67, "badge_diversidade": ["NEURODIVERGENTE"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["1 de 3 skills", "Nivel compativel"], "motivos": ["1 de 3 skills", "Nivel compativel"], 
            "skills": ["Excel", "Google Data Studio"], "cargoDesejado": "DATA_ANALYST"
        },
        {
            "candidato_id": "a1a2c3d4-0006-4000-8000-000000000006", "nome": "Luana Ferreira", "score_match": 96, "badge_diversidade": ["MULHER"], "destaque": "ALTA_COMPATIBILIDADE", 
            "explicacao": ["3 de 3 skills", "Nivel compativel"], "motivos": ["3 de 3 skills", "Nivel compativel"], 
            "skills": ["Python", "SQL", "Estatística"], "cargoDesejado": "DATA_ANALYST"
        },
        {
            "candidato_id": "a1a2c3d4-0007-4000-8000-000000000007", "nome": "Cesar Gomes", "score_match": 82, "badge_diversidade": ["NEGRO", "LGBTQIA+"], "destaque": "DIVERSIDADE_ALINHADA", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["SQL", "Metabase", "Looker"], "cargoDesejado": "DATA_ANALYST"
        },
        {
            "candidato_id": "a1a2c3d4-0008-4000-8000-000000000008", "nome": "Renata Souza", "score_match": 84, "badge_diversidade": ["MULHER"], "destaque": "SKILLS_COMPATIVEIS", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["Python", "Machine Learning Basico", "SQL"], "cargoDesejado": "DATA_ANALYST"
        },
        {
            "candidato_id": "a1a2c3d4-0009-4000-8000-000000000009", "nome": "Guilherme Rocha", "score_match": 78, "badge_diversidade": [], "destaque": "BOM_SCORE_GERAL", 
            "explicacao": ["2 de 3 skills", "Nivel compativel"], "motivos": ["2 de 3 skills", "Nivel compativel"], 
            "skills": ["Power BI", "DAX", "SQL"], "cargoDesejado": "DATA_ANALYST"
        },
        {
            "candidato_id": "a1a2c3d4-0010-4000-8000-000000000010", "nome": "Silvia Martins", "score_match": 91, "badge_diversidade": ["MULHER", "50+"], "destaque": "EXPERIENCIA_SOLIDA", 
            "explicacao": ["3 de 3 skills", "Nivel acima"], "motivos": ["3 de 3 skills", "Nivel acima"], 
            "skills": ["SQL", "Tableau", "ETL"], "cargoDesejado": "DATA_ANALYST"
        }
    ]