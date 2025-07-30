#!/bin/bash

# Pobierz najnowszy stan z GitHuba
git fetch origin main

# Sprawdź, czy są zmiany
if ! git diff --quiet HEAD origin/main; then
  echo "[DEPLOY] Zmiany wykryte na main – aktualizacja..."
  git pull
  bash install.sh
  echo "[DEPLOY] Ukończono instalację"
else
  echo "[DEPLOY] Brak zmian na main"
fi
