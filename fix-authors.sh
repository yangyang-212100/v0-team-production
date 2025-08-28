#!/bin/bash

# 修改特定提交的作者信息
git filter-branch --env-filter '
if [ "$GIT_COMMIT" = "9c263ff" ]; then
    export GIT_AUTHOR_NAME="yangyang-212100"
    export GIT_AUTHOR_EMAIL="yangyang212100@outlook.com"
    export GIT_COMMITTER_NAME="yangyang-212100"
    export GIT_COMMITTER_EMAIL="yangyang212100@outlook.com"
fi
if [ "$GIT_COMMIT" = "4c4813e" ]; then
    export GIT_AUTHOR_NAME="yangyang-212100"
    export GIT_AUTHOR_EMAIL="yangyang212100@outlook.com"
    export GIT_COMMITTER_NAME="yangyang-212100"
    export GIT_COMMITTER_EMAIL="yangyang212100@outlook.com"
fi
if [ "$GIT_COMMIT" = "95e44af" ]; then
    export GIT_AUTHOR_NAME="yangyang-212100"
    export GIT_AUTHOR_EMAIL="yangyang212100@outlook.com"
    export GIT_COMMITTER_NAME="yangyang-212100"
    export GIT_COMMITTER_EMAIL="yangyang212100@outlook.com"
fi
' --tag-name-filter cat -- --branches --tags
