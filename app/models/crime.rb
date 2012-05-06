class Crime
  def self.crimes
    @crimes ||= begin
      crimefile = Rails.root + 'data/sf_crime.2012_03.json'
      raw_crimes = File.open(crimefile) {|f| MultiJson.load(f)}
      columns = raw_crimes['meta']['view']['columns'].map{|column| column['name']}
      raw_crimes['data'].map{|row| Hash[columns.zip(row)]}
    end
  end
end
