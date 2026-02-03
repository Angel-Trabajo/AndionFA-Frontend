import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from "react-select";
import { getListSymbol, getConfigCrossing, postConfigCrossing } from '../service/FastService';
import '../styles/CrossingBuilderConfig.css';

const CrossingBuilderConfig = () => {
  const [symbols, setSymbols] = useState([]);
  const Timeframes = ['H1', 'H2', 'H3', 'H4', 'D1'];

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      max_sri: 0,
      min_sri: 0,
      n_totales: 0,
      min_operaciones: 0,
      max_depth: 0,
      maximo_weka_tree: 0,
      intentos: 0,
      aumento_arboles: 0,
      aumento_profundidad: 0,
      principal_symbol: "",
      timeframe: "H1",
      por_direccion: false,
      list_symbols_inversos: [],
      list_symbols: []
    }
  });

  useEffect(() => {
    const fetchSymbols = async () => {
      const symbols = await getListSymbol();
      setSymbols(symbols.symbols || []);
    };
    const fetchConfig = async () => {
      const config = await getConfigCrossing();
        reset({
            max_sri: config.max_sri || 0,
            min_sri: config.min_sri || 0,
            n_totales: config.n_totales || 0,
            min_operaciones: config.min_operaciones || 0,
            max_depth: config.max_depth || 0,
            maximo_weka_tree: config.maximo_weka_tree || 0,
            intentos: config.intentos || 0,
            aumento_arboles: config.aumento_arboles || 0,
            aumento_profundidad: config.aumento_profundidad || 0,
            principal_symbol: config.principal_symbol || "",
            timeframe: config.timeframe || "H1",
            por_direccion: config.por_direccion || false,
            list_symbols_inversos: config.list_symbols_inversos.map(symbol => ({ value: symbol, label: symbol })) || [],
            list_symbols: config.list_symbols.map(symbol => ({ value: symbol, label: symbol })) || []
        });
    };

    fetchSymbols();
    fetchConfig();
  }, [reset]);

  const opciones = symbols.map(symbol => ({
    value: symbol,
    label: symbol
  }));
  const onSubmit = (data) => {
    postConfigCrossing(data);
    alert('Configuración realizada')
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='myinputs'>
            <div className='input-container'>
            <label>Máxima variación</label>
            <input type="number" step="0.0001" min="0" max="1" {...register("max_sri")} />
            </div>
            <div className='input-container'>
            <label>Mínima variación</label>
            <input type="number" step="0.0001" min="0" max="1" {...register("min_sri")} />
            </div>
            <div className='input-container'>
            <label>N Totales</label>
            <input type="number" {...register("n_totales")} />
            </div>
            <div className='input-container'>
            <label>Mínimo operaciones</label>
            <input type="number" {...register("min_operaciones")} />
            </div>
            <div className='input-container'>
            <label>Máxima profundidad</label>
            <input type="number" {...register("max_depth")} />
            </div>
            <div className='input-container'>
            <label>Cantidad de árboles</label>
            <input type="number" {...register("maximo_weka_tree")} />
            </div>
            <div className='input-container'>
              <label>Intentos por símbolo</label>
              <input type="text" {...register("intentos")} />
            </div>
            <div className='input-container'>
                <label>Aumento de árboles</label>
                <input type="text" {...register("aumento_arboles")} />
            </div>
            <div className='input-container'>
                <label>Aumento de profundidad</label>
                <input type="text" {...register("aumento_profundidad")} />
            </div>
            <div className='input-container'>
            <label>Símbolo principal</label>
            <select {...register("principal_symbol")}>
                {opciones.map(opcion => (
                <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                </option>
                ))}
            </select>
            </div>
            <div className='input-container'>
            <label>Time frame</label>
            <select {...register("timeframe")}>
                {Timeframes.map(tf => (
                <option key={tf} value={tf}>
                    {tf}
                </option>
                ))}
            </select>
            </div>
            
            <div>
              <label>Lista de símbolos inversos</label>
              <Controller
                  name="list_symbols_inversos"
                  control={control}
                  render={({ field }) => (
                  <Select
                      {...field}
                      isMulti
                      options={opciones}
                      onChange={(val) => field.onChange(val)}
                      className="select-input"
                      classNamePrefix="custom-select"
                  />
                  )}
              />
              </div>
              <div className='input-container'>
                <label>Por dirección</label>
                <input type="checkbox" {...register("por_direccion")} />
            </div>
        </div>
       



        <div className="form-group">
        <div >
        <label>Lista de símbolos</label>
        <Controller
            name="list_symbols"
            control={control}
            render={({ field }) => (
            <Select
                {...field}
                isMulti
                options={opciones}
                onChange={(val) => field.onChange(val)}
                className="select-input"
                classNamePrefix="custom-select"
            />
            )}
        />
        </div>
        <div className="form-actions">
        <input type="submit" value="Configurar" className="btn" />
        </div>
        </div>
      </form>
    </div>
  );
};

export default CrossingBuilderConfig;