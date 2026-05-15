-- Atualiza imagens dos produtos com fotos de alta qualidade do Unsplash
update ayumi_products set
  image_url = 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80',
  gallery_urls = array[
    'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'
  ]
where slug = 'bolo-cenoura-brigadeiro';

update ayumi_products set
  image_url = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
  gallery_urls = array[
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80'
  ]
where slug = 'bolo-prestigio';

update ayumi_products set
  image_url = 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80',
  gallery_urls = array[
    'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80',
    'https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=800&q=80'
  ]
where slug = 'torta-mousse-limao';

update ayumi_products set
  image_url = 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
  gallery_urls = array[
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80'
  ]
where slug = 'torta-frutas-vermelhas';

update ayumi_products set
  image_url = 'https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=800&q=80',
  gallery_urls = array[
    'https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=800&q=80',
    'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80'
  ]
where slug = 'empadao-frango-caipira';

update ayumi_products set
  image_url = 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80',
  gallery_urls = array[
    'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80',
    'https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=800&q=80'
  ]
where slug = 'empadao-palmito';

update ayumi_products set
  image_url = 'https://images.unsplash.com/photo-1562440499-64e9a5839e97?w=800&q=80',
  gallery_urls = array[
    'https://images.unsplash.com/photo-1562440499-64e9a5839e97?w=800&q=80',
    'https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?w=800&q=80'
  ]
where slug = 'bolo-red-velvet';

update ayumi_products set
  image_url = 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80',
  gallery_urls = array[
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80',
    'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80'
  ]
where slug = 'torta-maracuja';
