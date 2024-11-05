import pandas as pd
import matplotlib.pyplot as plt


def load_data(filenames):
    dataframes = {}
    for name in filenames:
        print(name)
        df = pd.read_csv(f'{name}.csv')
        dataframes[name] = df
    return dataframes


# Configuração dos arquivos
files = ['llmData/p1_ollam32', 'llmData/p2_ollam32',
         'llmData/p1_phiM', 'llmData/p2_phiM', 'llmData/human']
dfs = load_data(files)

# Configurar o estilo dos gráficos usando apenas matplotlib
plt.style.use('default')  # Usando estilo padrão do matplotlib
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['font.size'] = 10

# 1. Gráfico comparativo de Sentimentos
plt.figure(figsize=(12, 6))
sentiment_data = []
for name, df in dfs.items():
    counts = df['Sentiment'].value_counts(normalize=True) * 100
    sentiment_data.append(counts)

sentiment_df = pd.DataFrame(sentiment_data, index=files)
sentiment_df.plot(kind='bar')
plt.title('Comparação de Sentimentos entre Análises')
plt.xlabel('Fonte de Análise')
plt.ylabel('Porcentagem (%)')
plt.legend(title='Sentimento')
plt.xticks(rotation=45)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('sentiment_comparison.png')
plt.close()

# 2. Gráfico comparativo de Níveis de Confiança
plt.figure(figsize=(12, 6))
confidence_data = []
for name, df in dfs.items():
    counts = df['Confidence Level'].value_counts(normalize=True) * 100
    confidence_data.append(counts)

confidence_df = pd.DataFrame(confidence_data, index=files)
confidence_df.plot(kind='bar')
plt.title('Comparação de Níveis de Confiança entre Análises')
plt.xlabel('Fonte de Análise')
plt.ylabel('Porcentagem (%)')
plt.legend(title='Nível de Confiança')
plt.xticks(rotation=45)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('confidence_comparison.png')
plt.close()

# 3. Gráfico comparativo de Presença de Ofensas
plt.figure(figsize=(12, 6))
offense_data = []
for name, df in dfs.items():
    counts = df['Presence of Offenses'].value_counts(normalize=True) * 100
    offense_data.append(counts)

offense_df = pd.DataFrame(offense_data, index=files)
offense_df.plot(kind='bar')
plt.title('Comparação de Presença de Ofensas entre Análises')
plt.xlabel('Fonte de Análise')
plt.ylabel('Porcentagem (%)')
plt.legend(title='Presença de Ofensas')
plt.xticks(rotation=45)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('offense_comparison.png')
plt.close()

# 4. Gráfico comparativo de Presença de Discriminação
plt.figure(figsize=(12, 6))
discrimination_data = []
for name, df in dfs.items():
    counts = df['Presence of Discrimination'].value_counts(
        normalize=True) * 100
    discrimination_data.append(counts)

discrimination_df = pd.DataFrame(discrimination_data, index=files)
discrimination_df.plot(kind='bar')
plt.title('Comparação de Presença de Discriminação entre Análises')
plt.xlabel('Fonte de Análise')
plt.ylabel('Porcentagem (%)')
plt.legend(title='Presença de Discriminação')
plt.xticks(rotation=45)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('discrimination_comparison.png')
plt.close()

# Imprimir estatísticas comparativas
print("\nEstatísticas Comparativas:")
for category in ['Sentiment', 'Confidence Level', 'Presence of Offenses', 'Presence of Discrimination']:
    print(f"\n{category}:")
    for name, df in dfs.items():
        print(f"\n{name}:")
        print(df[category].value_counts(normalize=True) * 100)
