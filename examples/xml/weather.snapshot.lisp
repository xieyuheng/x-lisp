'(weather
  (location :city Paris :country France :latitude 48.8566 :longitude 2.3522)
  (current :timestamp "2023-07-15T14:30:00Z"
   (temperature :unit celsius 22)
   (humidity :unit percent 65)
   (condition :type cloudy :description "Partly cloudy")
   (wind :speed 15 :direction NE :unit kmh))
  (forecast :day 1 :date "2023-07-16"
   (high :unit celsius 26)
   (low :unit celsius 18)
   (condition :type sunny)))
