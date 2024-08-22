VERSION_DIR="Production_Bundles"
GIT_BUNDLE_REPO = "https://github.com/projectsddu/PlacementProductionBundles.git"

cd "./${VERSION_DIR}"

if [ -d "PlacementProductionBundles" ]; then
    echo "> Git: Versioning Repository already exists."
    git pull
else
    echo "> Git: Cloning versioning repository."
    git clone https://github.com/projectsddu/PlacementProductionBundles.git
fi

cd "./PlacementProductionBundles"

rm -rf "PlacementPortalBundle.tar"

mv "../PlacementPortalBundle.tar" "."

git add .
 
git commit -m "Latest Version is pushed"

git push
