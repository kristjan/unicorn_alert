class GeocornController < ApplicationController
  NICE_NAMES = Hash.new('sparkles').update({
    'LARCENY/THEFT' => 'rainbows',
    'OTHER OFFENSES' => 'glitter',
    'NON-CRIMINAL' => 'unihorns',
    'ASSAULT' => 'awesome',
    'DRUG/NARCOTIC' => 'magic-rhino',
    'VANDALISM' => 'land-narwhal',
    'WARRANTS' => 'poop',
  })

  def sightings
    render :json => Crime.crimes[0..1000].map{|crime| crime['Location'][1..2] + [NICE_NAMES[crime['Category']]]}
  end

end
