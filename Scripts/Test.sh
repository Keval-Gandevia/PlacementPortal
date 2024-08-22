# ls
# VERSION=`ls -td -- */ | head -n 1 | cut -d'/' -f1`
# echo $VERSION
# VERSION="${VERSION:1:2}"
# VERSION="$((VERSION+1))"
# echo $VERSION
# mkdir "V"${VERSION}
# read ip

cd ..
while true;
do
RES=`git status`;
echo $RES;
# On branch main Your branch is up to date with 'origin/main'. nothing to commit, working tree clean
if [[ "$RES" == "On branch main Your branch is up to date with 'origin/main'.\n nothing to commit, working tree clean" ]]
then
    echo "Hello moto"
else
    echo "oh no!"
fi
sleep 1;
done