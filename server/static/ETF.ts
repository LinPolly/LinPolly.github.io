export const has = function (code: string) {
  return ETF.some(x => x["證券代號"].toString() === code.toString())
}

export const ETF = [
  {
    "證券代號": "0050",
    "證券簡稱": "元大台灣50",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "富時臺灣證券交易所臺灣50指數"
  },
  {
    "證券代號": "0051",
    "證券簡稱": "元大中型100",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "臺灣中型100指數"
  },
  {
    "證券代號": "0052",
    "證券簡稱": "富邦科技",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "臺灣證券交易所臺灣資訊科技指數"
  },
  {
    "證券代號": "0053",
    "證券簡稱": "元大電子",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "電子類加權股價指數"
  },
  {
    "證券代號": "0055",
    "證券簡稱": "元大MSCI金融",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "MSCI台灣金融指數"
  },
  {
    "證券代號": "0056",
    "證券簡稱": "元大高股息",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "臺灣高股息指數"
  },
  {
    "證券代號": "0057",
    "證券簡稱": "富邦摩台",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "MSCI台灣指數"
  },
  {
    "證券代號": "0061",
    "證券簡稱": "元大寶滬深",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "滬深300指數"
  },
  {
    "證券代號": "006203",
    "證券簡稱": "元大MSCI台灣",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "MSCI®臺灣指數"
  },
  {
    "證券代號": "006205(新臺幣)",
    "證券簡稱": "富邦上証(新臺幣)",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "上証180指數"
  },
  {
    "證券代號": "00625K(人民幣)",
    "證券簡稱": "富邦上証+R(人民幣)",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "上証180指數"
  },
  {
    "證券代號": "006204",
    "證券簡稱": "永豐臺灣加權",
    "發行人": "永豐證券投資信託股份有限公司",
    "標的指數": "臺灣證券交易所發行量加權股價指數"
  },
  {
    "證券代號": "006206",
    "證券簡稱": "元大上證50",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "上證50指數"
  },
  {
    "證券代號": "006207",
    "證券簡稱": "復華滬深(原簡稱:FH滬深)",
    "發行人": "復華證券投資信託股份有限公司",
    "標的指數": "滬深300指數"
  },
  {
    "證券代號": "006208",
    "證券簡稱": "富邦台50",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "富時臺灣證券交易所臺灣50指數"
  },
  {
    "證券代號": "00631L",
    "證券簡稱": "元大台灣50正2",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "臺灣50指數"
  },
  {
    "證券代號": "00632R",
    "證券簡稱": "元大台灣50反1",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "臺灣50指數"
  },
  {
    "證券代號": "00633L",
    "證券簡稱": "富邦上証正2",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "上証180兩倍槓桿指數"
  },
  {
    "證券代號": "00634R",
    "證券簡稱": "富邦上証反1",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "上証180反向指數"
  },
  {
    "證券代號": "00636(新臺幣)",
    "證券簡稱": "國泰中國A50(新臺幣)",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "富時中國A50指數"
  },
  {
    "證券代號": "00636K(美元)",
    "證券簡稱": "國泰中國A50+U(美元)",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "富時中國A50指數"
  },
  {
    "證券代號": "00635U",
    "證券簡稱": "期元大S&P黃金",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普高盛黃金ER指數(S&P GSCI Gold Excess Return Index)"
  },
  {
    "證券代號": "00637L",
    "證券簡稱": "元大滬深300正2",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "滬深300日報酬正向兩倍指數(CSI300 Daily Return Leveraged 2X Index)"
  },
  {
    "證券代號": "00638R",
    "證券簡稱": "元大滬深300反1",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "滬深300日報酬反向一倍指數(CSI300 Daily Return Inversed Index)"
  },
  {
    "證券代號": "00639",
    "證券簡稱": "富邦深100",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "深証100指數"
  },
  {
    "證券代號": "00642U",
    "證券簡稱": "期元大S&P石油",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普高盛原油ER指數(S&P GSCI Crude Oil Enhanced Excess Return)"
  },
  {
    "證券代號": "00640L",
    "證券簡稱": "富邦日本正2",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "東証正向2倍指數"
  },
  {
    "證券代號": "00641R",
    "證券簡稱": "富邦日本反1",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "東証反向1倍指數"
  },
  {
    "證券代號": "00645",
    "證券簡稱": "富邦日本",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "東証股價指數"
  },
  {
    "證券代號": "00643(新臺幣)",
    "證券簡稱": "群益深証中小(新臺幣)",
    "發行人": "群益證券投資信託股份有限公司",
    "標的指數": "中小企業100指數(SZSE SME 100 Index)"
  },
  {
    "證券代號": "00643K(人民幣)",
    "證券簡稱": "群益深証中小+R(人民幣)",
    "發行人": "群益證券投資信託股份有限公司",
    "標的指數": "中小企業100指數(SZSE SME 100 Index)"
  },
  {
    "證券代號": "00646",
    "證券簡稱": "元大S&P500",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普指數(S&P 500®)"
  },
  {
    "證券代號": "00647L",
    "證券簡稱": "元大S&P500正2",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普500 2倍槓桿指數(S&P 500R PR 2X Leverage Carry-Free Daily Index)"
  },
  {
    "證券代號": "00648R",
    "證券簡稱": "元大S&P500反1",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普500反向指數(S&P 500 PR Inverse Carry Free Daily)"
  },
  {
    "證券代號": "00650L",
    "證券簡稱": "復華香港正2(原簡稱:FH香港正2)",
    "發行人": "復華證券投資信託股份有限公司",
    "標的指數": "恒指槓桿指數"
  },
  {
    "證券代號": "00651R",
    "證券簡稱": "復華香港反1(原簡稱:FH香港反1)",
    "發行人": "復華證券投資信託股份有限公司",
    "標的指數": "恒指短倉指數"
  },
  {
    "證券代號": "00655L",
    "證券簡稱": "國泰中國A50正2",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "富時中國A50指數"
  },
  {
    "證券代號": "00656R",
    "證券簡稱": "國泰中國A50反1",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "富時中國A50指數"
  },
  {
    "證券代號": "00652",
    "證券簡稱": "富邦印度",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "NIFTY指數"
  },
  {
    "證券代號": "00653L",
    "證券簡稱": "富邦印度正2",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "NIFTY正向2倍指數"
  },
  {
    "證券代號": "00654R",
    "證券簡稱": "富邦印度反1",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "NIFTY反向1倍指數"
  },
  {
    "證券代號": "00657(新臺幣)",
    "證券簡稱": "國泰日經225(新臺幣)",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "日經225指數"
  },
  {
    "證券代號": "00657K(美元)",
    "證券簡稱": "國泰日經225+U(美元)",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "日經225指數"
  },
  {
    "證券代號": "00660",
    "證券簡稱": "元大歐洲50",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "歐洲STOXX50指數(EURO STOXX 50® PR in EUR)"
  },
  {
    "證券代號": "00661",
    "證券簡稱": "元大日經225",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "日經225指數(Nikkei Stock Average)"
  },
  {
    "證券代號": "00662",
    "證券簡稱": "富邦NASDAQ",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "NASDAQ-100指數"
  },
  {
    "證券代號": "00663L",
    "證券簡稱": "國泰臺灣加權正2",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "臺灣日報酬兩倍指數"
  },
  {
    "證券代號": "00664R",
    "證券簡稱": "國泰臺灣加權反1",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "臺指反向1倍指數"
  },
  {
    "證券代號": "00665L",
    "證券簡稱": "富邦恒生國企正2",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "恒生國企槓桿指數"
  },
  {
    "證券代號": "00666R",
    "證券簡稱": "富邦恒生國企反1",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "恒生國企短倉指數"
  },
  {
    "證券代號": "00675L",
    "證券簡稱": "富邦臺灣加權正2",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "臺灣證券交易所發行量加權股價日報酬正向兩倍指數"
  },
  {
    "證券代號": "00676R",
    "證券簡稱": "富邦臺灣加權反1",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "臺灣證券交易所發行量加權股價日報酬反向一倍指數"
  },
  {
    "證券代號": "00673R",
    "證券簡稱": "期元大S&P原油反1",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普高盛原油日報酬反向一倍ER指數(S&P GSCI Crude Oil 1x Inverse Index ER)"
  },
  {
    "證券代號": "00674R",
    "證券簡稱": "期元大S&P黃金反1",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普高盛黃金日報酬反向一倍ER指數(S&P GSCI Gold 1x Inverse Index ER)"
  },
  {
    "證券代號": "00669R",
    "證券簡稱": "國泰美國道瓊反1",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "道瓊斯單日反向指數"
  },
  {
    "證券代號": "00668(新臺幣)",
    "證券簡稱": "國泰美國道瓊(新臺幣)",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "道瓊斯工業平均指數"
  },
  {
    "證券代號": "00668K(美元)",
    "證券簡稱": "國泰美國道瓊+U(美元)",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "道瓊斯工業平均指數"
  },
  {
    "證券代號": "00678",
    "證券簡稱": "群益NBI生技",
    "發行人": "群益證券投資信託股份有限公司",
    "標的指數": "那斯達克生技指數（Nasdaq Biotechnology Index）"
  },
  {
    "證券代號": "00680L",
    "證券簡稱": "元大美債20正2",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "ICE美國政府20+年期債券2倍槓桿指數(ICE U.S. Treasury 20+ Year Bond 2X Leveraged Index)"
  },
  {
    "證券代號": "00681R",
    "證券簡稱": "元大美債20反1",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "ICE美國政府20+年期債券1倍反向指數(ICE U.S. Treasury 20+ Year Bond 1X Inverse Index)"
  },
  {
    "證券代號": "00670L",
    "證券簡稱": "富邦NASDAQ正2",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "NASDAQ-100正向2倍指數"
  },
  {
    "證券代號": "00671R",
    "證券簡稱": "富邦NASDAQ反1",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "NASDAQ-100反向1倍指數"
  },
  {
    "證券代號": "00682U",
    "證券簡稱": "期元大美元指數",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普美元ER指數(S&P US Dollar Futures Index ER)"
  },
  {
    "證券代號": "00683L",
    "證券簡稱": "期元大美元指正2",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普美元日報酬正向兩倍ER指數(S&P US Dollar Futures 2x Leverage Daily Index ER)"
  },
  {
    "證券代號": "00684R",
    "證券簡稱": "期元大美元指反1",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普美元日報酬反向一倍ER指數(S&P US Dollar Futures 1x Inverse Daily Index ER)"
  },
  {
    "證券代號": "00685L",
    "證券簡稱": "群益臺灣加權正2",
    "發行人": "群益證券投資信託股份有限公司",
    "標的指數": "臺指日報酬兩倍指數"
  },
  {
    "證券代號": "00686R",
    "證券簡稱": "群益臺灣加權反1",
    "發行人": "群益證券投資信託股份有限公司",
    "標的指數": "臺指反向一倍指數"
  },
  {
    "證券代號": "00690",
    "證券簡稱": "兆豐臺灣藍籌30",
    "發行人": "兆豐國際證券投資信託股份有限公司",
    "標的指數": "藍籌30指數"
  },
  {
    "證券代號": "00688L",
    "證券簡稱": "國泰20年美債正2",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "彭博20年期(以上)美國公債單日正向2倍指數"
  },
  {
    "證券代號": "00689R",
    "證券簡稱": "國泰20年美債反1",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "彭博20年期(以上)美國公債單日反向1倍指數"
  },
  {
    "證券代號": "00693U",
    "證券簡稱": "期街口S&P黃豆",
    "發行人": "街口證券投資信託股份有限公司",
    "標的指數": "標普高盛黃豆ER指數(S&P GSCI Soybeans Excess Return Index)"
  },
  {
    "證券代號": "00692",
    "證券簡稱": "富邦公司治理",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "臺灣證券交易所公司治理100 指數"
  },
  {
    "證券代號": "00700",
    "證券簡稱": "富邦恒生國企",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "恒生中國企業指數"
  },
  {
    "證券代號": "00703",
    "證券簡稱": "台新MSCI中國",
    "發行人": "台新證券投資信託股份有限公司",
    "標的指數": "MSCI 中國指數(MSCI China Index)"
  },
  {
    "證券代號": "00709",
    "證券簡稱": "富邦歐洲",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "富時發展歐洲指數"
  },
  {
    "證券代號": "00701",
    "證券簡稱": "國泰股利精選30",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司低波動股利精選30指數"
  },
  {
    "證券代號": "00702",
    "證券簡稱": "國泰標普低波高息",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "標普500低波高息指數"
  },
  {
    "證券代號": "00710B",
    "證券簡稱": "復華彭博非投等債(原簡稱:FH彭博非投等債)",
    "發行人": "復華證券投資信託股份有限公司",
    "標的指數": "彭博1至5年期美元高收益債券(不含中國)發行量五億美元產業10%上限指數(Bloomberg US High Yield 1-5 year ex China 500mln 10% Sector Capped Index)"
  },
  {
    "證券代號": "00711B",
    "證券簡稱": "復華彭博新興債(原簡稱:FH彭博新興債)",
    "發行人": "復華證券投資信託股份有限公司",
    "標的指數": "彭博新興市場10年期以上美元投資等級債券(不含中國)國家10%上限指數(Bloomberg EM USD ex China Investment Grade 10 year 10% Country Capped Index)"
  },
  {
    "證券代號": "00712",
    "證券簡稱": "復華富時不動產(原簡稱:FH富時不動產)",
    "發行人": "復華證券投資信託股份有限公司",
    "標的指數": "富時NAREIT抵押權型不動產投資信託指數(FTSE NAREIT Mortgage REITs Index)"
  },
  {
    "證券代號": "00706L",
    "證券簡稱": "期元大S&P日圓正2",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普日圓期貨日報酬正向2倍ER指數(S&P Japanese Yen Futures 2x Leverage Daily ER Index)"
  },
  {
    "證券代號": "00707R",
    "證券簡稱": "期元大S&P日圓反1",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普日圓期貨日報酬反向1倍ER指數(S&P Japanese Yen Futures 1x Inverse Daily ER Index)"
  },
  {
    "證券代號": "00708L",
    "證券簡稱": "期元大S&P黃金正2",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普高盛黃金日報酬正向兩倍ER指數(S&P GSCI Gold 2x Leveraged Index ER)"
  },
  {
    "證券代號": "00713",
    "證券簡稱": "元大台灣高息低波",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司特選高股息低波動指數"
  },
  {
    "證券代號": "00714",
    "證券簡稱": "群益道瓊美國地產",
    "發行人": "群益證券投資信託股份有限公司",
    "標的指數": "道瓊美國地產指數(Dow Jones U.S. Real Estate Index)"
  },
  {
    "證券代號": "00715L",
    "證券簡稱": "期街口布蘭特正2",
    "發行人": "街口證券投資信託股份有限公司",
    "標的指數": "標普高盛布蘭特原油日報酬正向兩倍ER指數(S&P GSCI Brent Crude 2X leveraged ER Index)"
  },
  {
    "證券代號": "00717",
    "證券簡稱": "富邦美國特別股",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "標普美國特別股指數"
  },
  {
    "證券代號": "00730",
    "證券簡稱": "富邦臺灣優質高息",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "道瓊斯台灣優質高股息30指數"
  },
  {
    "證券代號": "00728",
    "證券簡稱": "第一金工業30",
    "發行人": "第一金證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司工業菁英30指數"
  },
  {
    "證券代號": "00731",
    "證券簡稱": "復華富時高息低波(原簡稱:FH富時高息低波)",
    "發行人": "復華證券投資信託股份有限公司",
    "標的指數": "富時台灣高股息低波動指數(FTSE Taiwan High Dividend Low Volatility Index)"
  },
  {
    "證券代號": "00733",
    "證券簡稱": "富邦臺灣中小",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司中小型A級動能50指數"
  },
  {
    "證券代號": "00738U",
    "證券簡稱": "期元大道瓊白銀",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "道瓊白銀ER指數(Dow Jones Commodity Index Silver Excess Return)"
  },
  {
    "證券代號": "00735",
    "證券簡稱": "國泰臺韓科技",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "臺韓資訊科技指數"
  },
  {
    "證券代號": "00736",
    "證券簡稱": "國泰新興市場",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "富時新興市場(納入A股)指數"
  },
  {
    "證券代號": "00737",
    "證券簡稱": "國泰AI+Robo",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "納斯達克CTA全球人工智慧及機器人指數"
  },
  {
    "證券代號": "00739",
    "證券簡稱": "元大MSCI A股",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "MSCI中國A股國際通指數(MSCI China A Inclusion Index)"
  },
  {
    "證券代號": "00752",
    "證券簡稱": "中信中國50",
    "發行人": "中國信託證券投資信託股份有限公司",
    "標的指數": "MSCI 中國外資自由投資50不含A及B股指數"
  },
  {
    "證券代號": "00753L",
    "證券簡稱": "中信中國50正2",
    "發行人": "中國信託證券投資信託股份有限公司",
    "標的指數": "MSCI中國外資自由投資50不含A及B股單日正向2倍指數"
  },
  {
    "證券代號": "00757",
    "證券簡稱": "統一FANG+",
    "發行人": "統一證券投資信託股份有限公司",
    "標的指數": "NYSE FANG+ Index"
  },
  {
    "證券代號": "00763U",
    "證券簡稱": "期街口道瓊銅",
    "發行人": "街口證券投資信託股份有限公司",
    "標的指數": "道瓊銅ER指數(Dow Jones Commodity Index North American Copper Excess Return Index)"
  },
  {
    "證券代號": "00762",
    "證券簡稱": "元大全球AI",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "STOXX全球人工智慧指數(STOXX® Global Artificial Intelligence Index)"
  },
  {
    "證券代號": "00770",
    "證券簡稱": "國泰北美科技",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "標普北美科技行業指數"
  },
  {
    "證券代號": "00775B",
    "證券簡稱": "新光投等債15+",
    "發行人": "新光證券投資信託股份有限公司",
    "標的指數": "富時15年期以上投資等級債券指數"
  },
  {
    "證券代號": "00783",
    "證券簡稱": "富邦中証500",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "中証小盤500指數"
  },
  {
    "證券代號": "00830",
    "證券簡稱": "國泰費城半導體",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "美國費城半導體指數"
  },
  {
    "證券代號": "00771",
    "證券簡稱": "元大US高息特別股",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "標普美國高收益特別股指數(S&P U.S. High Yield Preferred Stock Index)"
  },
  {
    "證券代號": "00851",
    "證券簡稱": "台新全球AI",
    "發行人": "台新證券投資信託股份有限公司",
    "標的指數": "SG全球AI機器人精選指數"
  },
  {
    "證券代號": "00852L",
    "證券簡稱": "國泰美國道瓊正2",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "道瓊斯工業平均單日正向2倍指數"
  },
  {
    "證券代號": "00850",
    "證券簡稱": "元大臺灣ESG永續",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "臺灣永續指數(FTSE4Good TIP Taiwan ESG Index)"
  },
  {
    "證券代號": "00861",
    "證券簡稱": "元大全球未來通訊",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "ICE FactSet全球未來通訊指數(ICE FactSet Global NextGen Communications Index)"
  },
  {
    "證券代號": "00865B",
    "證券簡稱": "國泰US短期公債",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "彭博美國短期公債收益指數"
  },
  {
    "證券代號": "00875",
    "證券簡稱": "國泰網路資安",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "納斯達克ISE全球網路資安指數"
  },
  {
    "證券代號": "00876",
    "證券簡稱": "元大全球5G",
    "發行人": "元大證券投資信託股份有限公司",
    "標的指數": "iSTOXX全球5G關鍵科技指數"
  },
  {
    "證券代號": "00878",
    "證券簡稱": "國泰永續高股息",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "MSCI臺灣ESG永續高股息精選30指數"
  },
  {
    "證券代號": "00881",
    "證券簡稱": "國泰台灣5G+",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司特選臺灣上市上櫃FactSet 5G+通訊指數"
  },
  {
    "證券代號": "00882",
    "證券簡稱": "中信中國高股息",
    "發行人": "中國信託證券投資信託股份有限公司",
    "標的指數": "恒生中國高股息率指數"
  },
  {
    "證券代號": "00885",
    "證券簡稱": "富邦越南",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "富時越南30指數"
  },
  {
    "證券代號": "00891",
    "證券簡稱": "中信關鍵半導體",
    "發行人": "中國信託證券投資信託股份有限公司",
    "標的指數": "ICE FactSet臺灣ESG永續關鍵半導體指數"
  },
  {
    "證券代號": "00892",
    "證券簡稱": "富邦台灣半導體",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "ICE FactSet台灣核心半導體指數"
  },
  {
    "證券代號": "00893",
    "證券簡稱": "國泰智能電動車",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "ICE FactSet 全球智能電動車指數"
  },
  {
    "證券代號": "00895",
    "證券簡稱": "富邦未來車",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "MSCI ACWI IMI精選未來車30指數"
  },
  {
    "證券代號": "00894",
    "證券簡稱": "中信小資高價30",
    "發行人": "中國信託證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司特選小資高價30指數"
  },
  {
    "證券代號": "00896",
    "證券簡稱": "中信綠能及電動車",
    "發行人": "中國信託證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司特選臺灣上市上櫃綠能及電動車指數"
  },
  {
    "證券代號": "00897",
    "證券簡稱": "富邦基因免疫生技",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "NYSE FactSet全球基因免疫生技指數"
  },
  {
    "證券代號": "00898",
    "證券簡稱": "國泰基因免疫革命",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "Solactive全球基因免疫與醫療革命指數"
  },
  {
    "證券代號": "00901",
    "證券簡稱": "永豐智能車供應鏈",
    "發行人": "永豐證券投資信託股份有限公司",
    "標的指數": "特選臺灣智能車供應鏈聯盟指數"
  },
  {
    "證券代號": "00900",
    "證券簡稱": "富邦特選高股息30",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司特選臺灣上市上櫃高股息 30 指數"
  },
  {
    "證券代號": "00899",
    "證券簡稱": "FT潔淨能源",
    "發行人": "富蘭克林華美證券投資信託股份有限公司",
    "標的指數": "標普全球潔淨能源精選指數"
  },
  {
    "證券代號": "00903",
    "證券簡稱": "富邦元宇宙",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "Solactive元宇宙指數"
  },
  {
    "證券代號": "00902",
    "證券簡稱": "中信電池及儲能",
    "發行人": "中國信託證券投資信託股份有限公司",
    "標的指數": "ICE FactSet電池與儲能科技指數"
  },
  {
    "證券代號": "00904",
    "證券簡稱": "新光臺灣半導體30",
    "發行人": "新光證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司臺灣全市場半導體精選30指數"
  },
  {
    "證券代號": "00905",
    "證券簡稱": "FT臺灣Smart",
    "發行人": "富蘭克林華美證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司特選Smart多因子指數 (簡稱「特選Smart多因子指數」)"
  },
  {
    "證券代號": "00906",
    "證券簡稱": "大華元宇宙科技50",
    "發行人": "大華銀證券投資信託股份有限公司",
    "標的指數": "Solactive元宇宙科技與服務指數"
  },
  {
    "證券代號": "00908",
    "證券簡稱": "富邦入息REITs+",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "全球入息不動產與基礎建設指數"
  },
  {
    "證券代號": "00907",
    "證券簡稱": "永豐優息存股",
    "發行人": "永豐證券投資信託股份有限公司",
    "標的指數": "特選臺灣優選入息存股指數"
  },
  {
    "證券代號": "00911",
    "證券簡稱": "兆豐洲際半導體",
    "發行人": "兆豐國際證券投資信託股份有限公司",
    "標的指數": "洲際半導體指數 (ICE Semiconductor Index)"
  },
  {
    "證券代號": "00912",
    "證券簡稱": "中信臺灣智慧 50",
    "發行人": "中國信託證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司特選臺灣上市上櫃智慧50指數"
  },
  {
    "證券代號": "00909",
    "證券簡稱": "國泰數位支付服務",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "Solactive全球數位支付服務指數"
  },
  {
    "證券代號": "00910",
    "證券簡稱": "第一金太空衛星",
    "發行人": "第一金證券投資信託股份有限公司",
    "標的指數": "太空衛星指數"
  },
  {
    "證券代號": "00913",
    "證券簡稱": "兆豐台灣晶圓製造",
    "發行人": "兆豐國際證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司特選臺灣晶圓製造指數"
  },
  {
    "證券代號": "00915",
    "證券簡稱": "凱基優選高股息30",
    "發行人": "凱基證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司特選臺灣上市上櫃多因子優選高股息30指數"
  },
  {
    "證券代號": "00917",
    "證券簡稱": "中信特選金融",
    "發行人": "中國信託證券投資信託股份有限公司",
    "標的指數": "ICE FactSet特選金融及數據指數"
  },
  {
    "證券代號": "00916",
    "證券簡稱": "國泰全球品牌50",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "ICE FactSet全球品牌50指數"
  },
  {
    "證券代號": "00919",
    "證券簡稱": "群益台灣精選高息",
    "發行人": "群益證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司特選臺灣上市上櫃精選高息指數"
  },
  {
    "證券代號": "00920",
    "證券簡稱": "富邦ESG綠色電力",
    "發行人": "富邦證券投資信託股份有限公司",
    "標的指數": "ICE FactSet全球綠能ESG指數"
  },
  {
    "證券代號": "00918",
    "證券簡稱": "大華優利高填息30",
    "發行人": "大華銀證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司特選臺灣上市上櫃優選股利高填息30指數"
  },
  {
    "證券代號": "00921",
    "證券簡稱": "兆豐龍頭等權重",
    "發行人": "兆豐國際證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司特選臺灣產業龍頭存股等權重指數"
  },
  {
    "證券代號": "00923",
    "證券簡稱": "群益台灣ESG低碳",
    "發行人": "群益證券投資信託股份有限公司",
    "標的指數": "臺灣指數公司特選臺灣ESG低碳50指數"
  },
  {
    "證券代號": "00922",
    "證券簡稱": "國泰台灣領袖50",
    "發行人": "國泰證券投資信託股份有限公司",
    "標的指數": "MSCI台灣領袖50精選指數"
  },
  {
    "證券代號": "00925",
    "證券簡稱": "新光標普電動車",
    "發行人": "新光證券投資信託股份有限公司",
    "標的指數": "標普Kensho電動車市值加權指數"
  },
  {
    "證券代號": "00924",
    "證券簡稱": "復華S&P500成長",
    "發行人": "復華證券投資信託股份有限公司",
    "標的指數": "標普500成長指數"
  }
]