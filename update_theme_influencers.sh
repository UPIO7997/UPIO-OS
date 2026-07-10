#!/bin/bash
FILE="src/components/ThemeInfluencers.tsx"
sed -i 's/function Influencers()/function ThemeInfluencers()/g' $FILE
sed -i 's/"influencers"/"theme_influencers"/g' $FILE
sed -i 's/fetchInfluencers/fetchThemeInfluencers/g' $FILE
sed -i 's/setInfluencers/setThemeInfluencers/g' $FILE
sed -i 's/influencers/themeInfluencers/g' $FILE
sed -i 's/Influencer Management/Theme Influencer Management/g' $FILE
sed -i 's/Add Influencer/Add Theme Influencer/g' $FILE
sed -i 's/Search themeInfluencers.../Search theme influencers.../g' $FILE
sed -i 's/No themeInfluencers found./No theme influencers found./g' $FILE
sed -i 's/Edit Influencer/Edit Theme Influencer/g' $FILE
sed -i 's/const \[themeInfluencers, setThemeInfluencers\]/const \[themeInfluencers, setThemeInfluencers\]/g' $FILE
