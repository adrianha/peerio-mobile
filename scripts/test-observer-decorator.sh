QUERY="Component|SafeComponent"
SEARCH_PATH="app"
TEST="$(grep -lr -E "extends $QUERY" $SEARCH_PATH | xargs grep -L -E "\@observer")"
if [[ $TEST ]]; then
    echo "$TEST"
    echo "Found components without @observer decorator"
    exit 1
else
    echo "All observer decorators are in place"
fi
