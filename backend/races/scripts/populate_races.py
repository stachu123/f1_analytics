

from races.models import Race


races_data = [
    {"name": "Bahrain GP" , "date": "2024-03-2", "location": "Sakhir", "season": "2024", "track": "Bahrain International Circuit"},
    {"name": "Saudi Arabian GP" , "date": "2024-03-9", "location": "Jeddah", "season": "2024", "track": "Jeddah Corniche Circuit"},
    {"name": "Australian GP" , "date": "2024-03-24", "location": "Melbourne", "season": "2024", "track": "Melbourne Grand Prix Circuit"},
    {"name": "Japanese GP" , "date": "2024-04-07", "location": "Suzuka", "season": "2024", "track": "Suzuka Circuit"},
    {"name": "Chinese GP" , "date": "2024-04-21", "location": "Shanghai", "season": "2024", "track": "Shanghai International Circuit"},
    {"name": "Miami GP" , "date": "2024-05-05", "location": "Miami", "season": "2024", "track": "Miami International Autodrome"},
    {"name": "Emilia Romagna GP", "date": "2024-05-19", "location": "Imola", "season": "2024", "track": "Autodromo Enzo e Dino Ferrari"},
    {"name": "Monaco GP", "date": "2024-05-26", "location": "Monaco", "season": "2024", "track": "Circuit de Monaco"},
    {"name": "Canadian GP", "date": "2024-06-09", "location": "Montreal", "season": "2024", "track": "Circuit Gilles Villeneuve"},
    {"name": "Spanish GP", "date": "2024-06-23", "location": "Barcelona", "season": "2024", "track": "Circuit de Barcelona-Catalunya"},
    {"name": "Austrian GP", "date": "2024-06-30", "location": "Spielberg", "season": "2024", "track": "Red Bull Ring"},
    {"name": "British GP", "date": "2024-07-07", "location": "Silverstone", "season": "2024", "track": "Silverstone Circuit"},
    {"name": "Hungarian GP", "date": "2024-07-21", "location": "Mogyorod", "season": "2024", "track": "Hungaroring"},
    {"name": "Belgian GP", "date": "2024-07-28", "location": "Spa-Francorchamps", "season": "2024", "track": "Circuit de Spa-Francorchamps"},
    {"name": "Dutch GP", "date": "2024-08-25", "location": "Zandvoort", "season": "2024", "track": "Zandvoort Circuit"},
    {"name": "Italian GP", "date": "2024-09-01", "location": "Monza", "season": "2024", "track": "Autodromo Nazionale di Monza"},
    {"name": "Azerbaijan GP", "date": "2024-09-15", "location": "Baku", "season": "2024", "track": "Baku City Circuit"},
    {"name": "Singapore GP", "date": "2024-09-22", "location": "Marina Bay", "season": "2024", "track": "Marina Bay Street Circuit"},
    {"name": "United States GP", "date": "2024-10-20", "location": "Austin", "season": "2024", "track": "Circuit of the Americas"},
    {"name": "Mexican GP", "date": "2024-10-27", "location": "Mexico City", "season": "2024", "track": "Autoodromo Hermanos Rodriguez"},
    {"name": "Brazilian GP", "date": "2024-11-03", "location": "Sao Paulo", "season": "2024", "track": "Autoodromo Jose Carlos Pace"},
    
]   

def populate_races():
    for race in races_data:
        obj, created = Race.objects.get_or_create(
            name=race['name'],
            date=race['date'],
            location=race['location'],
            season=race['season'],
            track=race['track']
        )
        if created:
            print(f"Added race: {obj.name}")
        else:
            print(f"Race {obj.name} already exists")

if __name__ == '__main__':
    populate_races()

