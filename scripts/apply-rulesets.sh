#!/usr/bin/env bash
# Applies .github/rulesets/*.json to the repo (idempotent: updates by name).
# Run by a repo ADMIN (human), never by the agent. Requires: gh auth with admin scope.
set -euo pipefail
repo="${REPO:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"

for file in .github/rulesets/*.json; do
  name="$(node -p "require('./$file').name")"
  id="$(gh api "repos/$repo/rulesets" -q ".[] | select(.name==\"$name\") | .id" || true)"
  if [[ -n "$id" ]]; then
    gh api -X PUT "repos/$repo/rulesets/$id" --input "$file" > /dev/null && echo "updated: $name"
  else
    gh api -X POST "repos/$repo/rulesets" --input "$file" > /dev/null && echo "created: $name"
  fi
done

# Allow auto-merge, delete merged branches, squash only.
gh api -X PATCH "repos/$repo" \
  -F allow_auto_merge=true -F delete_branch_on_merge=true \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false > /dev/null
echo "repo merge settings applied"

# Dependency graph + alerts (needed by dependency-review in security.yml).
gh api -X PUT "repos/$repo/vulnerability-alerts" > /dev/null && echo "dependency graph and alerts enabled"
