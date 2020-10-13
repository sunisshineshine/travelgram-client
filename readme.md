YOGURTRAVEL - planner for every traveller
# https://yogurtravel.web.app/

# USAGE :

1. CREATE PLAN
ex) Trip to Europe for X-mas holiday 12/20 ~ 1/14

2. Add places for plan
- search place(based on google-map api)
- you can set when you will be got there

3. Add events for place
ex) Incheon International Airport
- Check-in until 2 hours before
- Buying some spirits at Tax-Free store

# DEVELOPEMENT :

developed with firebase
- using firebase hosting
- using firebase functions for create apis
- using cloud firestore for Database

frontend with React hooks, parcel bundling
- using react hooks for building reactive frontend
- using scss instead of css
- using typescript for all js code(include firebase function codes)
- type sharing with git* between web and functions
* : https://github.com/sunisshineshine/yogurtravel-interfaces
- parcel for local testing and building

apis
- using firebase functions with node ver.10 runtime and typescript
- google map apis for searching places
- Place objects on application are belonging with google-map-api's place id
