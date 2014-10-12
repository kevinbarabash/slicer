define(function () {
    var gauss = "float func(float x, float y) {\n" +
        "  return exp(-(x * x + y * y));\n" +
        "}";

    var waves = "float func(float x, float y) {\n" +
        "  return cos(5.0 * x * y) / 5.0;\n" +
        "}";

    return {
        gauss: gauss,
        waves: waves
    }
});
