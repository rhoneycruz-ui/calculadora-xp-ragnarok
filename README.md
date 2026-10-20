# Calculadora de XP — Ragnarok X

Calculadora web para medir a taxa de ganho de experiência e estimar o tempo necessário para subir níveis de Base e Job em Ragnarok X.

## Recursos

- registra dois pontos de medição com horário e experiência;
- calcula experiência total obtida, experiência por minuto e experiência por hora;
- trata separadamente EXP Base e EXP Job;
- estima o tempo restante para o próximo nível;
- permite preencher o horário atual automaticamente;
- possui layout responsivo para computador e celular;
- funciona inteiramente no navegador, sem backend e sem instalação.

## Como usar

1. Baixe ou clone este repositório.
2. Abra `Calculadora.html` em um navegador moderno.
3. Preencha o horário e a experiência Base/Job do primeiro ponto.
4. Clique em **Registrar ponto 1**.
5. Depois de algum tempo, informe o segundo ponto.
6. Clique em **Calcular** para ver a taxa de ganho.
7. Use **Prever Base** ou **Prever Job** para estimar o tempo restante até o próximo nível.

Também é possível testar sem clonar o projeto:

1. abra [`Calculadora.html`](Calculadora.html) no GitHub;
2. use **Download raw file**;
3. abra o arquivo baixado no navegador.

## Tecnologias

- HTML5
- CSS3 responsivo
- JavaScript puro
- Google Fonts

Todo o HTML, estilo e comportamento estão reunidos em um único arquivo, facilitando o uso local.

## Privacidade

A calculadora não possui servidor, conta de usuário ou banco de dados. Os valores digitados são processados somente na página aberta no navegador. O arquivo carrega fontes pela infraestrutura do Google Fonts quando há conexão com a internet.

## Limitações

- Os cálculos dependem de medições corretas de horário e experiência.
- Alterações nas tabelas de experiência do jogo podem exigir atualização manual da calculadora.
- Este é um projeto independente, sem vínculo oficial com Ragnarok X, Nuverse, Gravity ou suas afiliadas.

## Execução local opcional

Embora abrir o HTML diretamente seja suficiente, também é possível servir a pasta localmente:

```bash
python -m http.server 8000
```

Depois, acesse `http://localhost:8000/Calculadora.html`.
