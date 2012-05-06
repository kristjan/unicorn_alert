class GeocornController < ApplicationController
  def sightings
    render :json => Crime.crimes[0..1000].map{|crime| crime['Location'][1..2]}
  end
end
