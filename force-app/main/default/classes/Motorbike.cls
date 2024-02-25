public class Motorbike {
    private String manufacturer;
    private Integer horsepower;
    
    public Motorbike (String manufacturer, Integer horsepower) {
        this.manufacturer = manufacturer;
        this.horsepower = horsepower;
    }
    
    public void printVariables() {
        System.debug('Manuyfacturer is ' + manufacturer);
        System.debug('Horsepower is ' + horsepower);
    }
    
    

}