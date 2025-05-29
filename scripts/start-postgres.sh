#!/bin/bash

# Verifica se o PostgreSQL está rodando
if ! systemctl is-active --quiet postgresql; then
    echo "Iniciando PostgreSQL..."
    sudo service postgresql start
    sleep 2  # Aguarda 2 segundos para o serviço iniciar completamente
fi

# Executa o script de inicialização do banco
ts-node scripts/init-db.ts
