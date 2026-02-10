const a=`---\r
title: SIMULADOR ANIMAL\r
date: 2026-01-31\r
category: game\r
---\r
\r
# PROJETO: SIMULADOR ANIMAL\r
\r
**CONCEITO:**\r
Não é apenas um simulador de "ser" um animal. É um simulador de **PERCEPÇÃO**.\r
O foco central não é a sobrevivência mecânica (comer/dormir), mas a renderização do mundo através de aparelhos sensoriais radicalmente diferentes dos humanos.\r
\r
## VETORES DE SIMULAÇÃO:\r
\r
### 1\\. Espectro Visual\r
\r
O renderer do jogo deve alterar a própria geometria e iluminação baseada na espécie:\r
\r
* **Aves de Rapina:** Visão ultra-nítida com detecção de rastros de UV (urina de presas brilha na grama).\r
* **Insetos (Compostos):** Visão fragmentada, tempo de reação 10x mais rápido (o mundo se move em câmera lenta), cores distorcidas para navegação floral.\r
* **Caninos:** Baixa fidelidade de cor, mas contraste de movimento extremo e "visão de cheiro" (trilhas de partículas persistentes no ar).\r
\r
### 2\\. Echolocation (Morcegos/Cetáceos)\r
\r
A tela é escura. O mundo só existe quando você emite som.\r
\r
* **Ping:** Um pulso revela a geometria à frente.\r
* **Gameplay:** Você voa no "escuro", confiando no *delay* do retorno sonoro para criar um mapa mental 3D temporário que desvanece (fog of war reverso).\r
\r
### 3\\. Mecânicas de Caça/Fuga\r
\r
A tensão vem da limitação sensorial.\r
\r
* Um tubarão não "vê" a presa longe, ele sente a **eletricidade** dos batimentos cardíacos. O jogador veria auras pulsantes através de obstáculos sólidos.\r
* Uma cobra vê o **calor**. Presas camufladas visualmente brilhariam como faróis térmicos.\r
\r
**NOTA TÉCNICA:**\r
Necessário uso pesado de Shaders personalizados para simular distorção de lente, aberração cromática seletiva e pós-processamento de "lidar" para a ecolocalização.\r
\r
**STATUS:** \\[CONCEITUAL]\r
**PRIORIDADE:** BAIXA\r
\r
`;export{a as default};
