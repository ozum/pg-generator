
Açıklama
--------
Bu modül PostgreSQL veri tabanındann otomatik olarak Sequelize modellerini oluşturur. Veri tabanınızı inceleyerek her bir tablo için ayrı bir model dosyası oluşturur. Varsayılan konfigürasyon ayarları olabildiğince dikkatli seçilmiştir ve doğrudan değişiklik yapmadan kullanıma uygundur. Yine de dilerseniz konfigürasyon aracılığı ile bir çok davranış biçimini değiştirebilirsiniz. Bu doküman varsayılan konfigürasyona göre hazırlanmıştır. Dokümanda ilgili yerlerde konfigürasyon parametreleri ve varsayılan değerleri (Konfigürasyon parametresi:varsayılan değer) şeklinde belirtilmiştir.

Teşekkür
--------
Bu modül Fortibase desteği ile geliştirilmiştir.

Kullanım
--------

### Adım 1: npm -g komutu ile global olarak kurun.

Bu şekilde modülü ve CLI komutunu kurmuş olursunuz.

    $ npm install -g sequelize-pg-generator

### Adım 2: Model dosyalarını oluşturun.

Open terminal, go to your app.js root and create your models automatically into 'model' directory.

    $ cd path/to/my/node-app.js
    $ spgen -database my_database -u my_user -p my_password

### Adım 3: Kendi node.js uygulamanızda modelleri kullanın

Kendi uygulamanızda otomatik olarak oluşturulmuş olan Sequelize modellerini kullanın.

    var orm = require('../model');
    orm.setup('veri_tabim', 'kullanıc', 'sifre', {
        host: '127.0.0.1',
        logging: false,
        native: true
    });
    var sequelize = orm.sequelize;
    var contact = orm.model('public.contact'); // Şema kullanmayacak şekilde konfigüre edilebilir.

Windows Kullanıcıları
---------------------
Windows işletim sisteminde kurulum yapmak için bazı ipuçları. Bu modül pg modülünü kullanır. Eğer Windows üzerinde pg-native modülünü kullanmak isterseniz aşağıdaki noktalara dikkat ederek kurabilirsiniz:

* Python 2 kurulu olmalı. Bu yazı yazılırken Python 3 uyumluluğu yoktu.
* Python'un kurulu olduğu klasörü çevresel değişkenlerden (environment variables) path ve PYTHONPATH içine eklemelisiniz.
* PostgreSQL pg_config ve libpg.dll içeren klasörler'de path içine eklenmiş olmalı. Genellikle PostgreSQL bin ve lib klasörlerini eklemeniz yeterlidir. (Örneğin: C:\Program Files\PostgreSQL\9.3\bin C:\Program Files\PostgreSQL\9.3\lib)
* Visual Studio Build Tools (C:\Program Files (x86)\MSBuild) sisteminizde kurulu olmalı. VS 2012 sonrasında otomatik olarak kurulmaktadır. Eğer bu modülün kurulumu sırasında npm farklı bir Visual Studio sürümü sorarse sizde kurulu versiyonu aşağıdaki gibi kullanabilirsiniz:

    > npm install -g sequelize-pg-generator --msvs_version=2013

CLI Seçenekleri
---------------
    spgen [seçenekler]
    -h, --host [host]               Veri tabanının IP adresi veya host ismi.
        --port [port]               Veri tabanına bağlanmak için kullanılacak port
    -d, --database [veri tabanı]    Veri tabanı ismi
    -u, --user [kullanıcı]          Veri tabanına bağlanmak için kullanıcı ismi
    -p, --password [şifre]          Veri tabanına bağlanmak için şifre
    -s, --schema [schema]           Virgülle ayrılmış veri tabanı şemaları ismi (boşluk olmamalı).
    -o, --output [output]           Dosyaların üretileceği yer.
    -c, --config [config]           Konfigürasyon dosyasının yeri.
        --nolog                     Log çıktısı yazmayı durdurur.
        --resetConfig               Konfigürasyonu resetler. (Yan yol. Yayında kullanılması önerilmez.)
        --throwError                Hatayı konsola yazmak yerine error çıktısı üretir.

* Tamamen dokümante edilmiştir. (JSDoc HTML dosyaları doc dizini altındadır.),
* Test edilmiştir,
* Üretilen dosyalar başka bir modül gerektirmez,
* Çoklu PostgreSQL şema (schema) detseği,
* Tekten çoğa (One to many) ilişki desteği (hasMany ve belongsTo),
* Çoktan çoğan (Many to many) ilişki desteği (hasMany through ve belongsToMany),
* Şemalar arası ilişki desteği. (Örneğin public.firma tablosundan ozel_sema.musteri tablosuna),
* Yüksek oranda konfigüre edilebilir,
* Tamamen özelleştirilebilir,
* CLI desteği,
* Model ve ilişkiler için akıllı isimlendirme,
* Otomatik üretilen dosyalara kolayca müdahale,
* Hariç tutulan tablolar,
* Debug,
* Tabloya özel konfigürasyon,
* İsimleri ve alias'leri kontrol ederek çakışmaları önler.

UYARI: belongsToMany
----------------------
Sequelize 2.0 RC3 ve öncesi sürümlerde çoktan çoğa (many to many) ilişkiler için belongsToMany özelliği yoktur. Bu versiyondan sonra ise hasMany through ilişkiler ise yayından kalkacaktır (deprecated). Bu konuyla ilgili davranış konfigürasyonla ayarlanabilir. (Config: generate.hasManyThrough:false and generate.belongsToMany:true)

Özellikler
----------

### Üretilen Dosyalar Başka Modül Gerektirmez
Üretilen dosyalar çekirdek node modülleri ve Sequelize dışında herhangi bir modül gerektirmez.

### Çoklu Şema (schema) Detseği
Çoklu PostgreSQL şemalarını destekler. public dışında şemaları da kullanabilirsiniz. Kullanıcı komut satırından veya konfigürasyon dosyasından hangi şemaların işleneceğini seçebilir. Birden fazla şema dahil edilmesi durumunda modeller başına şema isimleri eklenerek ile beraber üretilebilir. (Config: generate.useSchemaName: true, database.schema: ["public"]) Bu sayede değişik şemalardaki aynı isimli tablolarda çakışma yaşanmaz.

    contact = orm.model('public.kisi'); // kisi tablosu için Sequelize modelini verir.
    
### Şema Ön Eki Olmadan
Kullanıcı isterse model isimlerine şema ismi eklenmesini durdurabilir.
    
    // Konfigürasyon dosyasında
    {...
        generate{
            useSchemaName: false
        }
    }
    
    contact = orm.model('kisi'); // kisi tablosu için Sequelize modelini verir.
    
### Tekten Çoğa (One To Many) İlişki Desteği
Bu modül otomatik olarak tekten çoğa ilişkileri tespit eder ve model.hasMany ve model.belongsTo sequelize ilişkilerini oluşturur.

### Çoktan Çoğa (Many To Many) İlişki Desteği
Eğer iki tablo bir ara birleşim tablosu ile bağlıysa, sequelize-pg-generator otomatik olarak bunu tespit eder ve many to many sequelize ilişkisini oluşturur. Eğer bir tabloda birden fazla yabancı anahtar (foreign key) varsa o tablo ara bağlantı tablosu kabul edilir.

                     hasMany              hasMany
    TABLO:   urun ------------< kalem >------------ sepet
    ALANLAR: id                sepet_id (FK)        id
             isim              urun_id (FK)         musteri_id (FK)
             renk              miktar

Bu modül belongsToMany ilişkilerini ve hasMany through ilişkilerini otomatik oluşturabilir. Bu yazı tarihi ile Sequelize master dalı hasMany through ilişkilerini kaldırılacak (deprecated) olarak işaretledi. Kullandığınız Sequelize versiyonuna göre istediğiniz ilişki türünün oluşturulmasını konfigürasyondan ayarlayabilirsiniz.

### Şemalar Arası İlişki Desteği
Değişik şemalarda bulunan tablolar arasındaki ilişkileri tespit eder. Örneğin public.firma tablosundan ozel_sema.musteri tablosuna olan ilişki tespit edilebilir.

### Yüksek Oranda Konfigüre Edilebilir
sequelize-pg-generator konfigürasyon için [config](https://www.npmjs.com/package/config) mdülünü kullanır. Ayrıca CLI vasıtası ile çağırırken de özel bir konfigürasyon dosyası kullanabilirsiniz. Konfigürasyon parametrelerinin açıklamalarını bu dokümanda aşağıda bulabilirsiniz.

### Tamamaen Özelleştirilebilir
sequelize-pg-generator model dosyalarını üretmek için [consolidate](https://www.npmjs.com/package/consolidate) uyumlu template'leri kullanır. Varsayılan template engine olarak [Swig](https://www.npmjs.com/package/swig) kullanılmaktadır. Kullanıcı orjinal template'lere dokunmadan kendi taslaklarının olduğu yeri konfigürasyon aracılığı ile belirterek onların kullanılmasını sağlayabilir. (Config: template.folder and template.engine:'swig') Kendi template'lerini kullanmak isteyenlerin bu modülün template dizinini incelemeri önerilir.

Özel template dizininde en azından şu üç dosya bulunmalıdır.
    index.ext  Varsayılan template dosyası. ext yerine kendi template'lerinizi uzantısını yazın.
    index.js   Bu dosya üretilen dosyalarla beraber kopyalanır. Amacı üretilen dosyaları kullanmaktır.
    utils.js   Bu dosya üretilen dosyalarla beraber kopyalanır. Yardımcı fonksiyonlar içerir.

### CLI Desteği
Eğer bu modülü önerildiği gibi npm -g ile global olarak kurduysanız spgen komutu model dosyaları üretmek için sisteminizde her yerden kullanılabilir.

### Model ve İlişkiler İçin Akıllı İsimlendirme
sequelize-pg-generator model isimlendirmesi için tablo veya şema.tablo isimlendirmesini kullanır. İlişkiler için yabancı anahtar isimlerini ve veri tabanında tanımlı ilişki isimlerini kullanır. (Veri tabanında ilişkileri düzgün isimlendiriyorsunuz değil mi?) Konfigürasyondan ayarlanarak camel case (tabloAdi) veya dokunulmamış (tablo_adi) şekilde isimlendirilmiş metodlar kullanılabilir. İsimlendirme teamülleri Sequelize modülü tavsiyelerine göre ayarlanmıştır ve 'as' parametresine atama yapılarak isimlendirme yapılır.

                      product_cart_line_items              cart_cart_line_items
    TABLO:   product -------------------------< line_item >--------------------- cart
    ALANLAR: id                                 cart_id (FK)                     id
             name                               product (FK)                     customer_id (FK)
             color                              quantity

    DİKKAT: line_item.cart_id alanı _id son eki içermesine rağmen line_item.product _id son eki içermemektedir. Bu tutarsız gibi gözüken durum kasten bu örnek için yapılmıştır.

    Nesne Tipi              İsimlendirme Kuralı
    ----------              -------------------
    Model                   tabloAdi veya schema.tabloAdi
    hasMany                 Veri tabanındaki ilişki adının çoğulu. Baştaki tablo adı otomatik silinebilir.
                            (Config: generate.stripFirstTableFromHasMany:true)
    belongsTo               Yabancı anahtarın tekil hali. Eğer dış anahtar ismi _id iel bitiyorsa silinir. Aksi durumda
                            alan ismi ile çakışmaması için başına 'related' ön eki eklenir.
                            (Config: generate.prefixForBelongsTo:'related')
    belongsToMany           Birleşim tablosu adı + birleşim tablosundaki diğer tabloya işaret eden yabancı anahtarın çoğul hali.
    hasMany({through:..})   Birleşim tablosu adı + birleşim tablosundaki diğer tabloya işaret eden yabancı anahtarın çoğul hali. (Sequelize'de kaldırılacak)

    Örnek yapı için sonuçlar:

    İlişki                  as                                  Detaylar
    ------                  --                                  --------
    product.hasMany         as:'cartLineItems'                  (Çoğul) 'product' tablo ismi 'product_cart_line_items' ilişki
                                                                isminin başından silinmiştir.
    product.belongsToMany   as:'cartLineItemCarts'              (Çoğul) _id eki 'cart_id' yabancı anahtar isminin sonundan
                                                                silinmiştir ve başına ilişki adı başındaki tablo adı olmadan eklenmiştir.
    product.hasMany Through as:'cartLineItemCarts'              (Çoğul) _id eki 'cart_id' yabancı anahtar isminin sonundan
                                                                silinmiştir ve başına ilişki adı başındaki tablo adı olmadan eklenmiştir.
    cart.hasMany            as:'cartLineItems'                  (Çoğul) 'cart' tablo ismi 'cart_cart_line_items' ilişki
                                                                isminin başından silinmiştir.
    cart.belongsToMany      as:'relatedCartLineItemProducts'    (Çoğul) _id eki olmadığından 'related' ön eki ve başına ilişki adı
                                                                başındaki tablo adı olmadan eklenmiştir.
    cart.hasMany Through    as:'relatedCartLineItemProducts'    (Çoğul) _id eki olmadığından 'related' ön eki ve başına ilişki adı
                                                                başındaki tablo adı olmadan  eklenmiştir.
    lineItem.belongsTo      as:'relatedProduct'                 (Tekil) _id eki olmadığından 'related' ön eki eklenmiştir.
    lineItem.belongsTo      as:'cart'                           (Tekil) _id eki 'cart_id' yabancı anahtar isminin sonundan silinmiştir.

Bir çok özellik gibi, oluşturulan dosyalara yıkıcı olmayan bir şekilde aşağıda açıklandığı şekilde müdahale edebilirsiniz.

### Otomatik Üretilen Dosyalara Kolayca Müdahale
Varsayılan olarak otomatik oluşturulan dosyalar path/to/model/definition-files dizininde tutulur. Ayrıca burada 'definition-files-custom' isimli bir dizin de oluşturulur. Kullanıcılar 'definition-files-custom' dizininde model dosyaları ile aynı isimde dosyalar oluşturarak orjinal dosyaların içeriğini değiştirebilir ve gerekli müdahaleleri güvenli bir şekilde yapabilirler. Bu modifikasyonları daha da kolay hale getirmek için utils isimli bir modül de model dizininde oluşturulur.

Bu modifikasyonlar yıkıcı değildir, çünkü bu dosyalar orjinal dosyadan miras alarak (inherit) orjinal dosyaya dokunulmadan değişiklik yapma şansı tanırlar. Varsayılan index.js dosyası miras alan bu dosya mevcut ise orjinal dosyayı çağırmaz ve miras alan dosyayı kullanır. Burada dikkat edilmesi gereken bu müdahalelerin henüz Sequelize nesnesi oluşturulmadan önce yapılıyor olmasıdır.

Örneğin cart isimli tablo için 'definition-files/cart.js' dosyası oluşturulur. Kullanıcı 'definition-files-custom/cart.js' isimli bir dosya oluşturarak aşağıdaki örnekte olduğu gibi istediği özelliklere müdahale edebilir. Tüm özellikler için otomatik oluşturulmuş dosyaların içine bakabilirsiniz.

    "use strict";
    var orm     = require('../index.js'),
        model   = require('../definition-files/public_cart.js'),
        util    = require('../utils.js')(model),
        Seq     = orm.Sequelize();

    module.exports = model;

    util.getAttribute('id').validate = {... Some Sequelize Validations}; // Sequelize validation ekleyin.
    util.getRelation('relatedProducts').details.as = 'soldItems';        // Varsayılan ilişki ismini beğenmediniz mi? Değiştirin.
    util.renameAttribute('customerId', 'clientId');                      // Alanın ismini değiştirin.

### Hariç Tutulan Tablolar

Bazı tabloların otomatik üretimin dışında bırakılması mümkündür. Konfigürasyonda (Config generate.skipTable:[]) dizisi hariç bırakılacak tabloları tanımlamak için kullanılır. sequelize-pg-generator bu tabloları ve ayrıca bu tablolara olan ve bu tablolardan başka tablolara olan ilişkileri oluşturmaz.

### Debug

Sizin yazdığınız uygulamadan ilk çağrılıp çalıştırıldığında, varsayılan index.js dosyası model dizininde debug.js isimli bir dosya oluşturur. Bu dosya incelenerek index.js'nin ne tip bir kod kullandığı anlaşılabilir. index.js dosyası yerine doğrudan modeller kullanılmak istenseydi bu şekilde bir kod kullanılıyor olacaktı. Ancak bu tip statik bir dosya kullanılsaydı, yıkıcı olmayan bir şekilde müdahalelere izin vermek çok zor olacaktı.

### İsim çakışmalarını önler
sequelize-pg-generator isim çakışmalarını önlemek için aynı tabloda aynı isim/alias sahibi başka bir alan veya ilişki var mı kontrol eder. Varsa uyarır.

### Tabloya Özel Konfigürasyon

Bazı tablolar için diğer tablolardan farklı olarak özel kurallar tanımlamak gerekebilir. Bu gibi durumlarda konfigürasyon tablo seviyesinde özel değişikliklere izin verir. Tüm 'generate' ve 'tableOptions' başlığı altında toplanan konfigürasyon parametreleri 'generateOverride' and 'tableOptionsOverride' başlıkları ile tabloya özel olarak değiştirilebilir.

Aşağıdaki örnekte contact tablosunun kendine özgü konfigürasyonlara sahip olması gösterilmiştir.

    "generate": {
        "columnDescription": true,
        "tableDescription": true,
        ...
    },
    "generateOverride": {
        "contact": {
            "tableDescription": false
        }
    },
    "tableOptions": {
        "timestamps": false,
        "camelCase": true,
        "paranoid": false,
        ...
    },
    "tableOptionsOverride": {
        "contact": {
            "paranoid": true
        }
    }
    ...

Konfigürasyon
=============
Konfigürasyon parametreleri ve varsayılan değerleri aşağıda açıklanmıştır. Konfigürasyon "sequelize-pg-generator" anahtarı altında toplanmıştır, çünkü sequelize-pg-generator konfigürasyonunuzu kendi uygulamanız içerisindeki konfigürasyon ile birleştirmek isteyebilirsiniz. Bu seyede sequelize-pg-generator konfigürasyon ayarlarının isimleri sizin konfigürasyonunuzla çakışmaz. [config](https://www.npmjs.com/package/node-config) buna izin vermektedir.

<table>
    <tr>
        <td colspan="3"><h4><strong>database</strong></h4></td>
    </tr>
    <tr>
        <td width="130">host</td>
        <td width="85">string</td>
        <td>Veri tabanının IP adresi veya host ismi.</td>
    </tr>
    <tr>
        <td>port</td>
        <td>number</td>
        <td>Veri tabanına bağlanmak için kullanılacak port.</td>
    </tr>
    <tr>
        <td>database</td>
        <td>string</td>
        <td>Veri tabanı ismi.</td>
    </tr>
    <tr>
        <td>user</td>
        <td>string</td>
        <td>Veri tabanına bağlanmak için kullanıcı ismi.</td>
    </tr>
    <tr>
        <td>password</td>
        <td>string</td>
        <td>Veri tabanına bağlanmak için şifre.</td>
    </tr>
    <tr>
        <td>schema</td>
        <td>Array(string)</td>
        <td>Otomatik dosyaların üretileceği veri tabanı şemaları ismi.</td>
    </tr>
    <tr>
        <td colspan="3"><h4><strong>template</strong></h4></td>
    </tr>
    <tr>
        <td>engine</td>
        <td>string</td>
        <td>Dosyaları üretmek için kullanılacak olan template engine. [consolidate](https://www.npmjs.com/package/consolidate) uyumlu tüm engine'ler kullanılabilir.</td>
    </tr>
    <tr>
        <td>extension</td>
        <td>string</td>
        <td>Template dosyalarının dosya uzantısı.</td>
    </tr>
    <tr>
        <td>folder</td>
        <td>string</td>
        <td>Template dosyalarının yer aldığı dizin.</td>
    </tr>
    <tr>
        <td colspan="3"><h4><strong>output</strong></h4></td>
    </tr>
    <tr>
        <td>log</td>
        <td>boolean</td>
        <td>Otomatik dosyaları üretirken log çıktısı üret.</td>
    </tr>
    <tr>
        <td>folder</td>
        <td>string</td>
        <td>Dosyaların üretileceği yer.</td>
    </tr>
    <tr>
        <td>beautify</td>
        <td>boolean</td>
        <td>Dosyaları [js-beautifier](http://jsbeautifier.org) kullanarak formatla.</td>
    </tr>
    <tr>
        <td>indent</td>
        <td>number</td>
        <td>Üretilen dosyalarda her bir tab karakteri için kaç boşluk kullanılacağı.</td>
    </tr>
    <tr>
        <td>preserveNewLine</td>
        <td>boolean</td>
        <td>Üretilen dosyada taslaklardan gelen yeni satır (new line) karakterlerini koru.</td>
    </tr>
    <tr>
        <td>warning</td>
        <td>boolean</td>
        <td>Eğer true olarak ayarlanırsa otomatik dosyalara ilgili dosyaya nasıl müdahale edileceğini anlatan bir yorum (comment) eklenir.</td>
    </tr>
    <tr>
        <td colspan="3"><h4><strong>generate</strong></h4></td>
    </tr>
    <tr>
        <td>stripFirstTableFromHasMany</td>
        <td>boolean</td>
        <td>Eğer true olrak ayarlanırsa has many ilişkilerinde ilişkinin isminde eğer varsa ilk baştaki tablo adı silinir. Örneğin: "product" tablosu için "product_cart_line_items" ilişki ismi "cart_line_items" olarak isimlendirilir.</td>
    </tr>
    <tr>
        <td>addTableNameToManyToMany</td>
        <td>boolean</td>
        <td>Eğer true olarak ayarlanırsa çoktan çoğa olan ilişkilerde (many to many) ilişkinin ismi'nin (as parametresi) başına birleşim tablosunun ismi eklenir. Bu isim çakışmalarını önlemekte yardımcı olur.</td>
    </tr>
    <tr>
        <td>addRelationNameToManyToMany</td>
        <td>boolean</td>
        <td>Eğer true olarak ayarlanırsa çoktan çoğa olan ilişkilerde (many to many) ilişkinin ismi'nin (as parametresi) başına ilişki ismi eklenir. Bu isim çakışmasını addTableNameToManyToMany seçeneğine göre daha iyi önler, çünkü aynı birleşim tablosuna ikiden fazla tablo bağlı olabilir.</td>
    </tr>
    <tr>
        <td>stripFirstTableNameFromManyToMany</td>
        <td>boolean</td>
        <td>Eğer true olrak ayarlanırsa çoktan çoğa (many to many) ilişkilerinde ilişkinin isminde eğer varsa ilk baştaki tablo adı silinir. Örneğin: "product" tablosu için "product_cart_line_items" ilişki ismi "cart_line_items" olarak isimlendirilir.</td>
    </tr>
    <tr>
        <td>hasManyThrough</td>
        <td>boolean</td>
        <td>Has many through ilişkileri hasMany(modelName, { through: '..' } şeklinde yapılandırılır. Sequelize version 2.0 RC3 ve sonrasında has many through ilişkileri kaldırılacak (DEPRECATED) olarak işaretlenmiştir. Bu versiyondan sonra has many through yerine belongToMany kullanmalısınız. hasManyThrough ve belongsToMany aynı tabloda aynı anda true olamaz.</td>
    </tr>
    <tr>
        <td>belongsToMany</td>
        <td>boolean</td>
        <td>belongsToMany ilişkileri kullanılır. Bu ilişki türü Sequelize version 2.0 RC4 ve sonrasında gelmiştir. Önceki Sequelize versiyonları bu ayar true iken çalışmazlar. hasManyThrough ve belongsToMany aynı tabloda aynı anda true olamaz.</td>
    </tr>
    <tr>
        <td>prefixForBelongsTo</td>
        <td>string</td>
        <td>belongsTo ilişkileri yabancı anahtar isminden "_id" eki atılarak isimlendirilir. Eğer yabancı anahtar "_id" eki içermiyorsa belongsTo ilişkilerinin alan isimleri ile karışmasını önlemek için başına bu ayarda belirtilen ön ek eklenir. "Model ve İlişkiler İçin Akıllı İsimlendirme" bölümüne bakabilirsiniz.</td>
    </tr>
    <tr>
        <td>useSchemaName</td>
        <td>boolean</td>
        <td>Eğer true olarak ayarlanırsa oluşturulan dosya isimlerinin ve model isimlerinin başına model isimleri eklenir. Bu ayar çoklu şema kullanan veri tabanlarında değişik şemalarda aynı isimdeki tabloların çakışmasını önlemek için kullanılır.</td>
    </tr>
    <tr>
        <td>modelCamelCase</td>
        <td>boolean</td>
        <td>Şema isimlerinde camel case (schemaName gibi) kullanılmasını sağlar.</td>
    </tr>
    <tr>
        <td>relationAccessorCamelCase</td>
        <td>boolean</td>
        <td>İlişki accessor metodlarında camel case (relationName gibi) kullanılmasını sağlar.</td>
    </tr>
    <tr>
        <td>columnAccessorCamelCase</td>
        <td>boolean</td>
        <td>Alan accessor metodlarında camel case (alanAdi gibi) kullanılmasını sağlar.</td>
    </tr>
    <tr>
        <td>columnDefault</td>
        <td>boolean</td>
        <td>Veri tabanı alanlarındaki varsayılan değerlerin Sequelize modelinde de oluşturulmasını sağlar. UYARI: SQL fonksiyonları henüz desteklenmemektedir. Sequelize'nin istediği şekilde bunları oluşturmak zordur. Bu nedenle bu işin veri tabanı sisteminde halledilmesi daha doğru olacaktır. Öte yandan bu değeri true yapıp, hatalı alanları müdahale ederek değiştirebilirsiniz.</td>
    </tr>
    <tr>
        <td>columnDescription</td>
        <td>boolean</td>
        <td>Alan açıklamalarını oluşturulan modele ekle.</td>
    </tr>
    <tr>
        <td>columnAutoIncrement</td>
        <td>boolean</td>
        <td>Otomatik artırım (auto increment) alanlarının modelde işaretlenmesini sağla.</td>
    </tr>
    <tr>
        <td>tableDescription</td>
        <td>boolean</td>
        <td>Tablo açıklamalarını oluşturulan modele ekle.</td>
    </tr>
    <tr>
        <td>dataTypeVariable</td>
        <td>string</td>
        <td>Sequelize veri tiplerini tanımlamak için nesneye bağlı "Sequelize.BOOLEAN" gibi bir değişken kullanır.This ayar bu değişkenin isminin ayarlanmasını sağlar.</td>
    </tr>
    <tr>
        <td>skipTable</td>
        <td>Array(string)</td>
        <td>Hariç tutulan tabloların listesi.</td>
    </tr>
    <tr>
        <td colspan="3"><h4><strong>tableOptions</strong></h4>Kullanıcı buraya istediği Sequelize.define opsiyonlarını (options) ekleyebilir. Bu opsiyonlar doğrudan Sequelize.define metoduna iletilir. Opsiyonlar için Sequelize dokümantasyonu incelenebilir. Bazı örnekler:</td>
    </tr>
    <tr>
        <td>timestamps</td>
        <td>boolean</td>
        <td>createdAt ve updatedAt zaman damgası alanlarını modele ekler.</td>
    </tr>
</table>

Varsayılan Konfigürasyon Ayarları
---------------------------------
Varsayılan konfigürasyon ayarları aşağıda listelenmiştir.

    module.exports = {
        "sequelize-pg-generator": {
            "database": {
                "host": "127.0.0.1",
                "port": 5432,
                "user": "user",
                "password": "password",
                "database": "",
                "schema": ["public"]
            },
            "template": {
                "engine": "swig",
                "extension": "html",
                "folder": path.join(__dirname, '..', 'template')
            },
            "output": {
                "log": true,
                "folder": "./model",
                "beautify": true,
                "indent": 4,
                "preserveNewLines": false,
                "warning": true
            },
            "generate": {
                "stripFirstTableFromHasMany": true,
                "addTableNameToManyToMany": false,
                "addRelationNameToManyToMany": true,
                "stripFirstTableNameFromManyToMany": true,
                "hasManyThrough": false,
                "belongsToMany": true,
                "prefixForBelongsTo": "related",
                "useSchemaName": true,
                "modelCamelCase": true,
                "relationAccessorCamelCase": true,
                "columnAccessorCamelCase": true,
                "columnDefault": false,
                "columnDescription": true,
                "columnAutoIncrement": true,
                "tableDescription": true,
                "dataTypeVariable": "Seq",
                "skipTable": []
            },
            "tableOptions": {
                "timestamps": false
            }
        }
    };

DİKKAT: Konfigürasyonun Singleton Davranışı
-------------------------------------------
Bu modül konfigürasyon için require('config') komutu ile config modülünü kullanır. Config modülü bu yazının yazıldığı sırada singleton yapısındaydı. Bu nedenle yapılan her çağrıya aynı nesneyi döndürüyordu. Sonuç olarak sonraki çağrılarda konfigürasyon dosyası değiştirilse ya da sequelize-pg-generator constructor çağrılırken başka bir konfigürasyon dosyası gösterilse bile ilk konfigürasyon dönüyor.

Normal kullanımda bu herhangi bir sorun teşkil etmez, çünkü sequelize-pg-generator aynı proses içinde genellikle sadece bir kere çağrılır. Ancak bu davranış test etmeyi engellemektedir. Kullanıcı da herhangi bir nedenle bu davranıştan kaçınmak isteyebilir. Bunu aşmak için, yan yol kullanan "resetConfig" isimli bir opsiyon eklenmiştir. Eğer bu seçenek true olarak ayarlanırsa konfigürasyon resetlenir ve yeniden okunur. Bunu yapabilmek için sequelize-pg-generator config modülünü node cache'den siler. lorenwest tarafından github hatalar bölümünde tavsiye edilen bu ara çözüm düşük verimde bir yöntemdir.

Bunu aktive etmek için resetConfig ayarını true olarak vermeniz veya cli'den çağırırken --resetConfig eklemeniz yeterlidir.

    var generator = require('sequelize-pg-generator');
    generator(function (err) {
        if (err) { callback(err); }
    }, {
        database: 'my_database',
        resetConfig: true
    );

sequelize-pg-creator aşağıdaki kodu kullanır:

    global.NODE_CONFIG = null;
    delete require.cache[require.resolve('config')];
    config = require('config');

Template Değişkenleri (Template'leri Özelleştirme)
==================================================
Özel template'ler oluşturmak için kullanıcı varsayılan template dizinini kopyalayabilir veya sıfırdan kendisi oluşturarak "template.folder" konfigürasyon ayarını yeni kullanılacak olan dizini gösterecek şekilde ayarlar. 3 dosya gereklidir: index.ext (.ext kullandığınız template engine'in kullandığı dosya uzantısıdır), index.js, utils.js.

index.js ve utils.js dosyaları doğrudan hedef dizine kopyalanır. index.ext template ise model dosyalarını üretmek için her tablo için çağrılır.

Template içerisinde kullanılacak olan değişkenler ve açıklamaları aşağıda verilmiştir. Eğer bir değer tanımlanmamışsa (undefined ise), o değerin key'i üretilen dosyalara hiç yazılmayacaktır.

<table>
    <tr>
        <td width="270"><strong>mainScript</strong></td>
        <td>Hedef dizinde üretilen index.js dosyasının patikası.</td>
    </tr>
    <tr>
        <td><strong>warning</strong></td>
        <td>Bu değişken konfigürasyon içerisinde özelleştirme ile ilgili uyarı mesajının gösterilmesi ile ilgili ayarın ne olduğunu tutar.</td>
    </tr>
    <tr>
        <td><strong>table</strong></td>
        <td>Tablo detaylarını, alanları ve ilişkileri vb. tutan nesne.</td>
    </tr>
    <tr>
        <td>table.modelName</td>
        <td>Tablo için model ismi.</td>
    </tr>
    <tr>
        <td>table.tableName</td>
        <td>Tablonun ismi.</td>
    </tr>
    <tr>
        <td>table.schema</td>
        <td>Tablonun PostgreSQL şema (schema) ismi</td>
    </tr>
    <tr>
        <td>table.comment</td>
        <td>Tablonun açıklaması.</td>
    </tr>
    <tr>
        <td>table.baseFileName</td>
        <td>Dosya isminin base kısmı.</td>
    </tr>
    <tr>
        <td>SPECIAL</td>
        <td>Konfigürasyon dosyasında Sequelize.define metoduna iletilmek için ayarlanan opsiyonlar da table nesnesi altında bulunur. Örneğin: table.timestamps</td>
    </tr>
    <tr>
        <td><strong>table.columns</strong></td>
        <td>Tablonun alanlarını içeren dizi.</td>
    </tr>
    <tr>
        <td>table.columns[n].source</td>
        <td>'generator' yazısı. Bu nesne değerinin otomatik üretildiğini gösterir. Eğer kullanıcı modifiye edilen özellikleri bir döngü ile işlemek isterse vb. nedenlerle ayrım yapabilmesi için kullanılabilir.</td>
    </tr>
    <tr>
        <td>table.columns[n].type</td>
        <td>Alanın Sequelize tipi.</td>
    </tr>
    <tr>
        <td>table.columns[n].accessorName</td>
        <td>Alana erişmek için kullanılacak olan accessor metodunun ismi.</td>
    </tr>
    <tr>
        <td>table.columns[n].name</td>
        <td>Alanın ismi.</td>
    </tr>
    <tr>
        <td>table.columns[n].primaryKey</td>
        <td>Eğer bu alan birincil anahtarsa bu değer true olur.</td>
    </tr>
    <tr>
        <td>table.columns[n].autoIncrement</td>
        <td>Eğer bu alan otomatik artırılan (auto increment) bir alansa bu değer true olur.</td>
    </tr>
    <tr>
        <td>table.columns[n].allowNull</td>
        <td>Eğer bu alan NULL değerine izin veriyorsa bu değer true olur.</td>
    </tr>
    <tr>
        <td>table.columns[n].defaultValue</td>
        <td>Alan için veri tabanındaki varsayılan değer.</td>
    </tr>
    <tr>
        <td>table.columns[n].unique</td>
        <td>Alan bir unique anahtar ise veya kompozit bir unique anahtarın parçası ise unique anahtar ismini içeren değer.</td>
    </tr>
    <tr>
        <td>table.columns[n].comment</td>
        <td>Alanın veri tabnındaki açıklaması.</td>
    </tr>
    <tr>
        <td>table.columns[n].references</td>
        <td>Eğer bu alanın bir referansı varsa, bu değer alanın referans ettiği tablonun adını içerir.</td>
    </tr>
    <tr>
        <td>table.columns[n].referencesKey</td>
        <td>Eğer bu alanın bir referansı varsa, bu değer alanın referans ettiği alanın adını içerir.</td>
    </tr>
    <tr>
        <td>table.columns[n].onUpdate</td>
        <td>Alanın on update değeri. (SET NULL, CASCADE, RESTRICT etc.)</td>
    </tr>
    <tr>
        <td>table.columns[n].onDelete</td>
        <td>Alanın on delete değeri. (SET NULL, CASCADE, RESTRICT etc.)</td>
    </tr>
    <tr>
        <td><strong>table.hasManies</strong></td>
        <td>Tablonun hasMany ilişkilerini içeren dizi.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].type</td>
        <td>İlişkinin tipini gösteren 'hasMany' değeri.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].source</td>
        <td>'generator' yazısı. Bu nesne değerinin otomatik üretildiğini gösterir. Eğer kullanıcı modifiye edilen özellikleri bir döngü ile işlemek isterse vb. nedenlerle ayrım yapabilmesi için kullanılabilir.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].name</td>
        <td>İlişkinin veri tabanındaki ismi.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].model</td>
        <td>Bu ilişkinin referans ettiği modelin ismi.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].as</td>
        <td>İlişki için alias ismi. Bu alias ismi Sequelize içerisinden bu ilişkiye erişmek için kullanılır.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].targetSchema</td>
        <td>İlişkinin referans ettiği PostgreSQL şemanın (schema) ismi.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].targetTable</td>
        <td>İlişkinin referans ettiği tablonun ismi.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].foreignKey</td>
        <td>İlişkinin referans ettiği tablodaki yabancı anahtar alanının ismi.</td>
    </tr>
    <tr>
        <td>table.hasManies[n].onDelete</td>
        <td>Alanın on delete değeri. (SET NULL, CASCADE, RESTRICT etc.)</td>
    </tr>
    <tr>
        <td>table.hasManies[n].onUpdate</td>
        <td>Alanın on update değeri. (SET NULL, CASCADE, RESTRICT etc.)</td>
    </tr>
    <tr>
        <td>table.hasManies[n].through</td>
        <td>Eğer bu bir through (many to many) ilişki ise ara birleşim tablosunun ismi. Through ilişkiler Sequelize 2.0 RC4 itibari ile kaldırılacak (DEPRECATED) olarak işaretlendi.</td>
    </tr>
    <tr>
        <td><strong>table.belongsTos</strong></td>
        <td>Tablonun belongsTo ilişkilerini içeren dizi.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].type</td>
        <td>İlişkinin tipini gösteren 'belongsTo' değeri.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].source</td>
        <td>'generator' yazısı. Bu nesne değerinin otomatik üretildiğini gösterir. Eğer kullanıcı modifiye edilen özellikleri bir döngü ile işlemek isterse vb. nedenlerle ayrım yapabilmesi için kullanılabilir.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].name</td>
        <td>İlişkinin veri tabanındaki ismi.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].model</td>
        <td>Bu ilişkinin referans ettiği modelin ismi.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].as</td>
        <td>İlişki için alias ismi. Bu alias ismi Sequelize içerisinden bu ilişkiye erişmek için kullanılır.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].targetSchema</td>
        <td>İlişkinin referans ettiği PostgreSQL şemanın (schema) ismi.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].targetTable</td>
        <td>İlişkinin referans ettiği tablonun ismi.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].foreignKey</td>
        <td>Bu tablodaki bu ilişkiye ait olan yabancı anahtar alanının ismi.</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].onDelete</td>
        <td>Alanın on delete değeri. (SET NULL, CASCADE, RESTRICT etc.)</td>
    </tr>
    <tr>
        <td>table.belongsTos[n].onUpdate</td>
        <td>Alanın on update değeri. (SET NULL, CASCADE, RESTRICT etc.)</td>
    </tr>
    <tr>
        <td><strong>table.belongsToManies</strong></td>
        <td>Tablonun belongsToMany ilişkilerini içeren dizi. belongsToMany ilişkilleri Sequelize 2.0 RC4 ve sonraki versiyonlarda mevcuttur.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].type</td>
        <td>İlişkinin tipini gösteren 'belongsToMany' değeri.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].source</td>
        <td>'generator' yazısı. Bu nesne değerinin otomatik üretildiğini gösterir. Eğer kullanıcı modifiye edilen özellikleri bir döngü ile işlemek isterse vb. nedenlerle ayrım yapabilmesi için kullanılabilir.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].name</td>
        <td>İlişkinin veri tabanındaki ismi.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].model</td>
        <td>Bu ilişkinin referans ettiği modelin ismi.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].as</td>
        <td>İlişki için alias ismi. Bu alias ismi Sequelize içerisinden bu ilişkiye erişmek için kullanılır.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].targetSchema</td>
        <td>İlişkinin referans ettiği PostgreSQL şemanın (schema) ismi.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].targetTable</td>
        <td>İlişkinin referans ettiği tablonun ismi.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].foreignKey</td>
        <td>Ara birleşim tablosundan bu tabloya referans veren yabancı anahtar alanının ismi.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].otherKey</td>
        <td>Ara birleşim tablosundan diğer hedef tabloya referans veren yabancı anahtar alanının ismi.</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].onDelete</td>
        <td>Alanın on delete değeri. (SET NULL, CASCADE, RESTRICT etc.)</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].onUpdate</td>
        <td>Alanın on update değeri. (SET NULL, CASCADE, RESTRICT etc.)</td>
    </tr>
    <tr>
        <td>table.belongsToManies[n].through</td>
        <td>Ara birleşim tablosunun ismi.</td>
    </tr>
    <tr>
        <td>table.relations</td>
        <td>Tüm türlerdeki ilişkilerin birleşik listesini içeren dizi. Bu dizi hasMany ilişkileri, hasMany through ilişkileri, belongsTo ilişkileri, belongsToMany ilişkilerinin hepsini içerir.</td>
    </tr>
</table>


API
===

#Index

**Modules**

* [lib/index](#module_lib/index)
  * [module.exports(callback, options) ⏏](#exp_module_lib/index)
* [path/to/model](#module_path/to/model)
  * [path/to/model.setup(database, username, password, obj)](#module_path/to/model.setup)
  * [path/to/model.model(name)](#module_path/to/model.model)
  * [path/to/model.Sequelize()](#module_path/to/model.Sequelize)

**Classes**

* [class: GeneratorUtil](#GeneratorUtil)
  * [new GeneratorUtil(model)](#new_GeneratorUtil)
  * [generatorUtil.getRelation(as)](#GeneratorUtil#getRelation)
  * [generatorUtil.getAttribute(name)](#GeneratorUtil#getAttribute)
  * [generatorUtil.renameAttribute(oldName, newName)](#GeneratorUtil#renameAttribute)
 
<a name="module_lib/index"></a>
#lib/index
**Author**: Özüm Eldoğan  
<a name="exp_module_lib/index"></a>
##module.exports(callback, options) ⏏
Generates model files for Sequelize ORM.

**Params**

- callback `function` - Function to execute after completion of auto generation. callback(err)  
- options `object` - Options to override configuration parameters from config file  
  - host `string` - IP address or host name of the database server  
  - port `number` - Port of database server to connect  
  - database `string` - Database name  
  - user `string` - Username to connect to database  
  - password `string` - Password to connect to database  
  - schema `Array` - List of comma separated names of the database schemas to traverse. Example public,extra_schema.  
  - output `string` - Output folder  
  - config `string` - Path of the configuration file  
  - nolog `boolean` - Don't output log of generated files.  
  - resetConfig `boolean` - Reset configuration via side-step solution to prevent singleton behaviour. (Not recomended for production)  

<a name="module_path/to/model"></a>
#path/to/model
This file is auto generated by sequelize-pg-generator.

**Author**: Özüm Eldoğan  
**Members**

* [path/to/model](#module_path/to/model)
  * [path/to/model.setup(database, username, password, obj)](#module_path/to/model.setup)
  * [path/to/model.model(name)](#module_path/to/model.model)
  * [path/to/model.Sequelize()](#module_path/to/model.Sequelize)

<a name="module_path/to/model.setup"></a>
##path/to/model.setup(database, username, password, obj)
Sets up sequelize models based on model files in given directory for given database details.

**Params**

- database `string` - Name of the database to connect  
- username `string` - Username of the database  
- password `string` - Password of the database  
- obj `Object` - Object to pass new Sequelize() function. See Sequelize for details.  

**Example**  
var orm = require('../model');
orm.setup('path/to/model', 'database', 'user', 'password', {
    host: '127.0.0.1',
    logging: false,
    native: true
});

<a name="module_path/to/model.model"></a>
##path/to/model.model(name)
Returns requested model with given name.

**Params**

- name `string` - Model name  

**Returns**: `object` - - Sequelize model  
<a name="module_path/to/model.Sequelize"></a>
##path/to/model.Sequelize()
Returns Sequelize object.

**Returns**: `Sequelize` - - Sequelize object  
<a name="GeneratorUtil"></a>
#class: GeneratorUtil
**Members**

* [class: GeneratorUtil](#GeneratorUtil)
  * [new GeneratorUtil(model)](#new_GeneratorUtil)
  * [generatorUtil.getRelation(as)](#GeneratorUtil#getRelation)
  * [generatorUtil.getAttribute(name)](#GeneratorUtil#getAttribute)
  * [generatorUtil.renameAttribute(oldName, newName)](#GeneratorUtil#renameAttribute)

<a name="new_GeneratorUtil"></a>
##new GeneratorUtil(model)
**Params**

- model   

<a name="GeneratorUtil#getRelation"></a>
##generatorUtil.getRelation(as)
Searches and returns relation with the given alias. Alias is defined in sequelize options with parameter 'as'

**Params**

- as `string` - Alias of the relation.  

**Returns**: `Object`  
<a name="GeneratorUtil#getAttribute"></a>
##generatorUtil.getAttribute(name)
Searches and returns relation with the given attribute. Alias is defined in sequelize options with parameter 'as'

**Params**

- name `string` - Name of the attribute.  

**Returns**: `Object`  
<a name="GeneratorUtil#renameAttribute"></a>
##generatorUtil.renameAttribute(oldName, newName)
Searches and returns relation with the given attribute. Alias is defined in sequelize options with parameter 'as'

**Params**

- oldName `string` - Name of the attribute which it's name to be changed.  
- newName `string` - New name of the attribute.  


---------------------------------------

<a name="History"></a>
History & Release Notes
=======================

Note
----
Version history for minimal documentation updates are not listed here to prevent cluttering.
Important documentation changes are included anyway.

0.3.0 / 2014-12-30
==================
* Removed: pg-native dependency removed. Some users experienced problems during install.
* Added: generate.addRelationNameToManyToMany configuration to prefix relation aliases prevent further name clashes which cannot be prevented by generate.addTableNameToManyToMany. Default: true.
* Added: generate.stripFirstTableNameFromManyToMany configuration added. Default: true
* Changed: generate.addTableNameToManyToMany configuration default is false now.
* Changed: Default naming rule for many to many relations.
* Added: Logging uses Winston module now.
* Added: Doc update for Windows OS users.
* Fixed: Database tables without any column throws error when warning configuration is true.

0.2.0 / 2014-12-27
==================
* Added: Automatic alias and naming validations to prevent name clash.
* Added: generate.addTableNameToManyToMany configuration to prefix relation aliases prevent name clash. Default: true.
* Added: --throwError option added to CLI. This option decides wheter to throw error or simply log.
* Added: Prevent hasMany through and belongsToMany true at the same time.
* Fixed: generate.prefixForBelongsTo aliases are not properly camel cased.
* Fixed: --resetConfig option does not work from CLI
* Doc update

0.1.17 / 2014-12-26
===================
* Fixed: CLI command does not work.
* Added: Required parameters warning.

0.1.15 / 2014-12-26
===================
* Added: Turkish documentation added.
* Fixed: Typos and mistakes in documents.

0.1.12 / 2014-12-23
===================
* Added: Tests added.
* Added: --nolog option added to spgen command.
* Added: --resetConfig option. Also details and caveat added to the document.
* Fix: lib/index.js exported function expects different parameters than written in documentation.
* Fix: Command line arguments fixed.
* Fix: Data type variable name configuration is ignored.
* Document update.

0.1.0 / 2014-12-23
==================
* Initial version.

The MIT License (MIT)

Copyright (c) 2014 Özüm Eldoğan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

