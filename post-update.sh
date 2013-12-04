cd full-interface
git add --all .
git stash
cd ..

git submodule init
git submodule update
chmod -R a+rx .
chmod a+w store
