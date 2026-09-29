import fs from 'fs';

const b6 = JSON.parse(fs.readFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/batch6_verify_results.json', 'utf8'));
const b7 = JSON.parse(fs.readFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/batch7_verify_results.json', 'utf8'));
const all = { ...b6, ...b7 };

const SUB = {
  'B0CT2R7199': 'B0GLD9K9LF',
  'B09TG52XT4': 'B096N8DN2H',
  'B09BBLN72F': 'B0BM9BFLMX',
  'B096N85ZHW': 'B0B1J5PYCF',
};

const guides = [
  [21, "Best All-in-One Printers for Home Use", "best-all-in-one-printers-for-home-use", ["B0CT2R7199","B0FMBGXC2C","B0FMBTJLX6","B09CDXKNB9","B0CT8ZJ7ZC","B09TRZLPXP","B0FGCCWV6T","B0GPFHCYK7"]],
  [22, "Best Wireless Printers for Home Offices", "best-wireless-printers-for-home-offices", ["B0CT2R7199","B0FMBGXC2C","B0FMBTJLX6","B0CT8ZJ7ZC","B09CDXKNB9","B0CPLFTPCV","B0GPFHCYK7","B09TG52XT4"]],
  [23, "Best Printers with Automatic Document Feeders", "best-printers-with-automatic-document-feeders", ["B09CDXKNB9","B0CT8ZJ7ZC","B09TRZLPXP","B0FP3LJ74G","B0GPFHCYK7","B0FC5KYF71","B09P45LR5T","B0FGCH2QK2"]],
  [24, "Best Duplex Printers for Home Offices", "best-duplex-printers-for-home-offices", ["B0CT8ZJ7ZC","B0FMBGXC2C","B0FMBTJLX6","B09TRZLPXP","B0FGCCWV6T","B0CPLFTPCV","B0GPFHCYK7","B0GTN9ZGRS"]],
  [25, "Best AirPrint Printers", "best-airprint-printers", ["B0CT2R7199","B0FMBGXC2C","B0FMBTJLX6","B09CDXKNB9","B0CT8ZJ7ZC","B09TG52XT4","B07WL4JNH7","B08FDZZK3H"]],
  [26, "Best Printers with USB Ports", "best-printers-with-usb-ports", ["B0CT2R7199","B0FMBTJLX6","B09CDXKNB9","B0CT8ZJ7ZC","B0CPLFTPCV","B09TRZLPXP","B07FN93WW7","B08FDZZK3H"]],
  [27, "Best Printers Without Wi-Fi", "best-printers-without-wifi", ["B0D96T79YF","B0CPLFTPCV","B0FP3LJ74G","B07FN93WW7","B01IIOMMRS","B0FGCCWV6T","B0GTN9ZGRS","B0GPFLM562"]],
  [28, "Best Ink Tank Printers for Home Offices", "best-ink-tank-printers-for-home-offices", ["B096N8DN2H","B096N8CNBZ","B096N85ZHW","B0BM9BFLMX","B09P45LR5T","B0FC5KYF71","B096N9JMXF","B0BL466Y41"]],
  [29, "Best Cartridge-Free Printers", "best-cartridge-free-printers", ["B096N8DN2H","B096N8CNBZ","B096N85ZHW","B0BM9BFLMX","B0FC5KYF71","B096N9JMXF","B08XZQVWZW","B084TV6BVM"]],
  [30, "Best Printers with Cheap Ink", "best-printers-with-cheap-ink", ["B096N8DN2H","B096N8CNBZ","B0BM9BFLMX","B09P45LR5T","B0BL466Y41","B08XZQVWZW","B0FC5KYF71","B096N9JMXF"]],
  [31, "Best Printers for Occasional Use", "best-printers-for-occasional-use", ["B0CT2R7199","B0FMBGXC2C","B0FMBTJLX6","B09CDXC13T","B0D1DV6FV5","B010A7TZ76","B08FDZZK3H","B0DZC56ZH4"]],
  [32, "Best Printers for High-Volume Printing", "best-printers-for-high-volume-printing", ["B0CPLFTPCV","B0CFCYYZLM","B0GPFHCYK7","B0GTN9ZGRS","B0FP3LJ74G","B0FC5KYF71","B09P45LR5T","B0BL466Y41"]],
  [33, "Best Printers for Low-Volume Printing", "best-printers-for-low-volume-printing", ["B0CT2R7199","B0FMBGXC2C","B0FMBTJLX6","B09CDXC13T","B0D1DV6FV5","B010A7TZ76","B0DZC56ZH4","B08FDZZK3H"]],
  [34, "Best Printers for Documents", "best-printers-for-documents", ["B0CPLFTPCV","B0FMBTJLX6","B09CDXKNB9","B0CT8ZJ7ZC","B0GTN9ZGRS","B0CFCYYZLM","B0GPFHCYK7","B0FP3LJ74G"]],
  [35, "Best Printers for Black-and-White Documents", "best-printers-for-black-and-white-documents", ["B0CPLFTPCV","B0CFCYYZLM","B0GTN9ZGRS","B0D96T79YF","B0GPFLM562","B0FP3LJ74G","B01IIOMMRS","B07FN93WW7"]],
  [36, "Best Monochrome Laser Printers for Home Offices", "best-monochrome-laser-printers-for-home-offices", ["B0CPLFTPCV","B0CFCYYZLM","B0GTN9ZGRS","B0D96T79YF","B0GPFLM562","B0FP3LJ74G","B01IIOMMRS","B07FN93WW7"]],
  [37, "Best Color Laser Printers for Home Offices", "best-color-laser-printers-for-home-offices", ["B0FP3LJ74G","B0FC5KYF71","B0FGCCWV6T","B0GPFHCYK7","B0FGCH2QK2","B09P45LR5T","B0CT8ZJ7ZC","B09TRZLPXP"]],
  [38, "Best Inkjet Printers for Home Use", "best-inkjet-printers-for-home-use", ["B0CT2R7199","B0FMBGXC2C","B0FMBTJLX6","B09CDXKNB9","B096N8DN2H","B096N8CNBZ","B0BM9BFLMX","B0BL466Y41"]],
  [39, "Best Printers for Shipping Labels", "best-printers-for-shipping-labels", ["B01MA3EYC5","B09VF4Z2WQ","B0CP7STCSP","B0BXXPHZLR","B07S48NHYS","B099MLDBKJ","B0DR86V4ZV","B0DX6RVJF7"]],
  [40, "Best Printers for Stickers and Cricut", "best-printers-for-stickers-and-cricut", ["B01MA3EYC5","B0CP7STCSP","B0BXXPHZLR","B0BTYD7H28","B07S48NHYS","B0CXP3WZZC","B0FR97FJD8","B0FSKN56ZN"]],
  [41, "Best Printers for Cardstock", "best-printers-for-cardstock", ["B0FMBGXC2C","B09CDXKNB9","B0CT2R7199","B0FMBTJLX6","B0CPLFTPCV","B096N8DN2H","B09P45LR5T","B0BSMSYM9N"]],
  [42, "Best Printers for Envelopes", "best-printers-for-envelopes", ["B0CPLFTPCV","B0CPL7HRQN","B09CDXKNB9","B0FMBGXC2C","B0CT2R7199","B0CFCYYZLM","B00K5UZO0Q","B0FMBTJLX6"]],
  [43, "Best Photo Printers for Home Use", "best-photo-printers-for-home-use", ["B0FDL1LS3B","B09CDXKNB9","B0FMBGXC2C","B096N8DN2H","B0BSMSYM9N","B0CT2R7199","B09P45LR5T","B0FMBTJLX6"]],
  [44, "Best Printers for Checks", "best-printers-for-checks", ["B08MSWMTN6","B0DJWMNN2M","B0CPLFTPCV","B0CPL7HRQN","B0CFCYYZLM","B0CT2R7199","B09CDXKNB9","B0FMBGXC2C"]],
  [45, "Best Receipt Printers for Small Businesses", "best-receipt-printers-for-small-businesses", ["B0CNT2F4Q5","B08V4H7T47","B099MLDBKJ","B0DX6RVJF7","B0CL481GS1","B0CPL7HRQN","B0CT2R7199","B09CDXKNB9"]],
  [46, "Best Printers Under $100", "best-printers-under-100", ["B0CT2R7199","B0FMBGXC2C","B09CDXKNB9","B0CPL7HRQN","B00K5UZO0Q","B0GLD9K9LF","B0FMBTJLX6","B010A7TZ76"]],
  [47, "Best Printers Under $150", "best-printers-under-150", ["B0FMBGXC2C","B09CDXKNB9","B0GLD9K9LF","B0CPL7HRQN","B0CT2R7199","B096N8DN2H","B00K5UZO0Q","B0FMBTJLX6"]],
  [48, "Best Printers Under $200", "best-printers-under-200", ["B0CPLFTPCV","B096N8DN2H","B09P45LR5T","B0BL466Y41","B0CT8ZJ7ZC","B0BSMSYM9N","B0GLD9K9LF","B0FMBGXC2C"]],
  [49, "Best Budget Laser Printers", "best-budget-laser-printers", ["B0CPL7HRQN","B0CPLFTPCV","B0CFCYYZLM","B00K5UZO0Q","B0GTN9ZGRS","B0D96T79YF","B0GPFLM562","B01IIOMMRS"]],
  [50, "Best Budget Printers for Home Offices", "best-budget-printers-for-home-offices", ["B0CT2R7199","B0FMBGXC2C","B09CDXKNB9","B0CPL7HRQN","B0GLD9K9LF","B096N8DN2H","B0FMBTJLX6","B00K5UZO0Q"]],
  [51, "Best Quiet Printers for Home Offices", "best-quiet-printers-for-home-offices", ["B0CPLFTPCV","B0CFCYYZLM","B096N8DN2H","B09P45LR5T","B0GLD9K9LF","B0CT2R7199","B09CDXKNB9","B0FGC43YCL"]],
  [52, "Best Fast Printers for Home Offices", "best-fast-printers-for-home-offices", ["B0CPLFTPCV","B0CFCYYZLM","B0GTN9ZGRS","B0FP3LJ74G","B09P45LR5T","B0FGC43YCL","B09CDXKNB9","B0GLD9K9LF"]],
  [53, "Best Printers That Don't Jam", "best-printers-that-dont-jam", ["B0CPLFTPCV","B0CFCYYZLM","B0GTN9ZGRS","B096N8DN2H","B09P45LR5T","B09CDXKNB9","B0GLD9K9LF","B0FGC43YCL"]],
  [54, "Best Printers Without Ink Subscriptions", "best-printers-without-ink-subscriptions", ["B096N8DN2H","B096N8CNBZ","B096N85ZHW","B0BM9BFLMX","B09P45LR5T","B0CPLFTPCV","B0CFCYYZLM","B0GTN9ZGRS"]],
  [55, "Best Printers for Chromebooks", "best-printers-for-chromebooks", ["B0CT2R7199","B09CDXKNB9","B0GLD9K9LF","B096N8DN2H","B09P45LR5T","B0FGC43YCL","B0CPLFTPCV","B07W69LJ41"]],
  [56, "Best Printers for Mac and MacBook", "best-printers-for-mac-and-macbook", ["B0CPLFTPCV","B09CDXKNB9","B096N8DN2H","B09P45LR5T","B0GLD9K9LF","B07WL4JNH7","B0FGC43YCL","B0CT2R7199"]],
  [57, "Best Printers for iPhone and iPad", "best-printers-for-iphone-and-ipad", ["B09CDXKNB9","B07WL4JNH7","B07W69LJ41","B096N8DN2H","B0GLD9K9LF","B0FGC43YCL","B0CT2R7199","B09P45LR5T"]],
  [58, "Best Printers for Windows 11", "best-printers-for-windows-11", ["B0CPLFTPCV","B09CDXKNB9","B096N8DN2H","B09P45LR5T","B0GLD9K9LF","B0FGC43YCL","B0CT2R7199","B07WL4JNH7"]],
  [59, "Best Portable Printers", "best-portable-printers", ["B0F1Z1VLV6","B0CYP944DP","B0F9YBMJDV","B09P45LR5T","B0FGC43YCL","B0GLD9K9LF","B0CT2R7199","B09CDXKNB9"]],
  [60, "Best Mini Printers for Small Spaces", "best-mini-printers-for-small-spaces", ["B0F9YBMJDV","B0CYP944DP","B0CT2R7199","B0GLD9K9LF","B0FMBGXC2C","B09CDXKNB9","B0F1Z1VLV6","B096N8DN2H"]],
];

const manifest = guides.map(([n, title, slug, asins]) => {
  const products = asins.map(rawAsin => {
    const asin = SUB[rawAsin] || rawAsin;
    const wasSubbed = SUB[rawAsin] ? rawAsin : null;
    const data = all[asin];
    if (!data || data.status === 'FAIL') {
      return { asin, status: 'MISSING', wasSubbed };
    }
    return { asin, status: data.status, title: data.title, price: data.price, img: data.img, wasSubbed };
  });
  const missing = products.filter(p => p.status === 'MISSING');
  return { n, title, slug, categorySlug: 'desk-setup', subcategorySlug: 'printers', products, missingCount: missing.length };
});

fs.writeFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/batch7_guide_manifest.json', JSON.stringify(manifest, null, 2));

console.log('Total guides:', manifest.length);
const withMissing = manifest.filter(g => g.missingCount > 0);
console.log('Guides with missing/unresolved ASINs:', withMissing.length);
withMissing.forEach(g => console.log(' -', g.n, g.title, g.products.filter(p=>p.status==='MISSING').map(p=>p.asin)));
