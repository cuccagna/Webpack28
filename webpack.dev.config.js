const pathM = require('path');
/* const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 */
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

module.exports = {
   output: {
      path: pathM.resolve(__dirname, './dist'),
      assetModuleFilename: '[path][name][ext]', 
      publicPath: 'auto', // use auto public path instead of `./`
      clean: true /* {
         dry: false,
         keep:/\.css$/ 
      } */   //Serve per cancellare la cartella dist dalla precedente esecuzione
   },
   mode: 'development',
   watch:true,
   module: {
      rules:[
         {
            test: /\.(png|jpe?g|webp|avif|gif|svg)$/,
            type: 'asset',
            parser: {
               dataUrlCondition: {
                  maxSize: 3 * 1024 //3 Kilobytes QUI CAMBIA LA SOGLIA A 3 KByte
                 /*  Il logo Angular è 6, 5 Kbyte.Cambia la soglia per includere
                  nel bundle js il logo */
               }
            },
         },
         /*rules per quando provi ad importare un file css da javascript. Uso due loaders
         css-loader  legge il contenuto del css e ritorna il contenuto
         style-loader prende il css e lo mette nella pagina, mette il css proprio nel
                      bundle.js Poi vedremo come generarli come file separati
         */
         {
            test: /\.css$/,
            use: ['css-loader'] 
         },
         {
            test: /\.scss$/,
            use: ['css-loader','sass-loader'] 
         }
      ]
   },
   plugins: [
      new HtmlBundlerPlugin({
         // define entry templates here
         entry: {
           index: './src/index.ejs', // => dist/index.html
         },
         js: {
           // output filename of JS
           filename: 'js/[name].[contenthash:8].js',
           //inline: true, // inline JS into HTML
         },
         css: {
           // output filename of CSS, replaces the functionality of MiniCssExtractPlugin
           filename: 'css/[name].[contenthash:8].css',
           inline: true, // inline CSS into HTML, replaces the functionality of style-loader
         },
       }),
      /*Nella seguente configurazione di questo plugin eliminiamo tutti i file
      e le cartelle e sottocartelle a partire dalla cartella .dist che è quella
      specificata in ouput.path
      asteriscoasterisco/asterisco  vuol dire tutti i file e le sottocartelle
      Inoltre specifico di ripulire anche tutti i file e le sottocartelle 
      dentro la cartella nomeCartella
      Nota che devo fornire un percorso assoluto perchè di default parte
      da ./dist (impostata in output.path)
      */
      //new CleanWebpackPlugin({
        // cleanOnceBeforeBuildPatterns: [
          //  '**/*',
           // path.join(process.cwd(),'nomeCartella/**/*')
      //]
   //})
   ],
   // enable HMR with live reload
   devServer: {
      open: true, // open in browser
      static: {
         directory: pathM.join(__dirname, 'dist'),
      },
      watchFiles: {
         paths: ['src/**/*.*'],
         options: {
            usePolling: true,
         },
      },
   },
}