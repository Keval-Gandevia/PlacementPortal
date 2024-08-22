cd Deployment/Versions/
VERSION=`ls -td -- */ | head -n 1 | cut -d'/' -f1`
VERSION="${VERSION:1:2}"
VERSION="$((VERSION+1))"
mkdir "V"$VERSION
cd "V"$VERSION
git clone https://github.com/projectsddu/PlacementProductionBundles.git
cd PlacementProductionBundles
tar -xf PlacementPortalBundle.tar
npm i