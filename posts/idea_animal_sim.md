---
title: SIMULADOR ANIMAL
date: 2026-01-31
category: game
---

# PROJETO: SIMULADOR ANIMAL

**CONCEITO:**
Não é apenas um simulador de "ser" um animal. É um simulador de **PERCEPÇÃO**.
O foco central não é a sobrevivência mecânica (comer/dormir), mas a renderização do mundo através de aparelhos sensoriais radicalmente diferentes dos humanos.

## VETORES DE SIMULAÇÃO:

### 1\. Espectro Visual

O renderer do jogo deve alterar a própria geometria e iluminação baseada na espécie:

* **Aves de Rapina:** Visão ultra-nítida com detecção de rastros de UV (urina de presas brilha na grama).
* **Insetos (Compostos):** Visão fragmentada, tempo de reação 10x mais rápido (o mundo se move em câmera lenta), cores distorcidas para navegação floral.
* **Caninos:** Baixa fidelidade de cor, mas contraste de movimento extremo e "visão de cheiro" (trilhas de partículas persistentes no ar).

### 2\. Echolocation (Morcegos/Cetáceos)

A tela é escura. O mundo só existe quando você emite som.

* **Ping:** Um pulso revela a geometria à frente.
* **Gameplay:** Você voa no "escuro", confiando no *delay* do retorno sonoro para criar um mapa mental 3D temporário que desvanece (fog of war reverso).

### 3\. Mecânicas de Caça/Fuga

A tensão vem da limitação sensorial.

* Um tubarão não "vê" a presa longe, ele sente a **eletricidade** dos batimentos cardíacos. O jogador veria auras pulsantes através de obstáculos sólidos.
* Uma cobra vê o **calor**. Presas camufladas visualmente brilhariam como faróis térmicos.

**NOTA TÉCNICA:**
Necessário uso pesado de Shaders personalizados para simular distorção de lente, aberração cromática seletiva e pós-processamento de "lidar" para a ecolocalização.

**STATUS:** \[CONCEITUAL]
**PRIORIDADE:** BAIXA

